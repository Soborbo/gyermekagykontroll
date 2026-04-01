import type { APIRoute } from "astro";
import { signupSchema } from "../../lib/schema";
import { Resend } from "resend";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const result = signupSchema.safeParse(body);

    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string;
        if (!errors[field]) {
          errors[field] = issue.message;
        }
      }
      return new Response(JSON.stringify({ errors }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const data = result.data;

    const courseNames: Record<string, string> = {
      gyermekagykontroll: "Gyermekagykontroll tanfolyam",
      tantorta: "Tantorta tréning",
    };

    const discountNames: Record<string, string> = {
      none: "Nincs",
      sibling: "Testvérkedvezmény",
      repeat: "Ismétlőkedvezmény",
      agykontroll: "Agykontrollkedvezmény",
    };

    const courseName = courseNames[data.courseType] || data.courseType;
    const discountName = discountNames[data.discount] || data.discount;

    // Escape user-provided fields for safe HTML embedding
    const safe = {
      childName: escapeHtml(data.childName),
      parentName: escapeHtml(data.parentName),
      parentEmail: escapeHtml(data.parentEmail),
      parentPhone: escapeHtml(data.parentPhone),
      courseDate: escapeHtml(data.courseDate),
      grade: escapeHtml(data.grade),
      successSubject: data.successSubject ? escapeHtml(data.successSubject) : "",
      specialAttentionReason: data.specialAttentionReason ? escapeHtml(data.specialAttentionReason) : "",
      message: data.message ? escapeHtml(data.message) : "",
    };

    // Build email HTML
    const emailHtml = `
      <h2>Új jelentkezés érkezett!</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Tanfolyam</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${courseName}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Időpont</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safe.courseDate}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Osztály</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safe.grade}</td></tr>
        ${data.parentAttends ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Szülő részt vesz</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.parentAttends}</td></tr>` : ""}
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Résztvevő neve</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safe.childName}</td></tr>
        ${data.successSubject ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Sikeres tantárgy</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safe.successSubject}</td></tr>` : ""}
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Különleges figyelem</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.specialAttention}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Pszichiátriai kezelés</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.psychiatricTreatment}</td></tr>
        ${data.specialAttentionReason ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Különleges figyelem oka</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safe.specialAttentionReason}</td></tr>` : ""}
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Kedvezmény</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${discountName}</td></tr>
        ${data.photoConsent ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Fotó hozzájárulás</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.photoConsent}</td></tr>` : ""}
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Szülő neve</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safe.parentName}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safe.parentEmail}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Telefon</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safe.parentPhone}</td></tr>
        ${data.message ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Üzenet</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${safe.message}</td></tr>` : ""}
      </table>
    `;

    const confirmationHtml = `
      <h2>Köszönjük a jelentkezést!</h2>
      <p>Kedves ${safe.parentName}!</p>
      <p>Jelentkezését megkaptuk a(z) <strong>${courseName}</strong> tanfolyamra, a következő időpontra: <strong>${safe.courseDate}</strong>.</p>
      <p>A résztvevő neve: <strong>${safe.childName}</strong></p>
      <p>Legkésőbb a tanfolyam előtt egy héttel felvesszük Önnel a kapcsolatot.</p>
      <p>Ha bármilyen kérdése van, forduljon hozzánk bizalommal:</p>
      <ul>
        <li>Telefon: +36 30 620 7373</li>
        <li>Email: info@gyermekagykontroll.hu</li>
      </ul>
      <p>Üdvözlettel,<br/>Tihanyi Rita<br/>Gyermekagykontroll oktató</p>
    `;

    // Send emails via Resend
    const resendApiKey = import.meta.env.RESEND_API_KEY;

    if (!resendApiKey) {
      console.warn("RESEND_API_KEY is not set — emails will not be sent!");
      return new Response(
        JSON.stringify({ success: true, warning: "Email küldés nem elérhető, de a jelentkezést rögzítettük." }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    const resend = new Resend(resendApiKey);
    const emailErrors: string[] = [];

    // Email to Rita
    try {
      await resend.emails.send({
        from: "Gyermekagykontroll <noreply@gyermekagykontroll.hu>",
        to: "info@gyermekagykontroll.hu",
        subject: `Új jelentkezés: ${safe.childName} - ${courseName}`,
        html: emailHtml,
        replyTo: data.parentEmail,
      });
    } catch (err) {
      console.error("Failed to send admin email:", err);
      emailErrors.push("admin");
    }

    // Confirmation email to parent
    try {
      await resend.emails.send({
        from: "Gyermekagykontroll <noreply@gyermekagykontroll.hu>",
        to: data.parentEmail,
        subject: `Jelentkezés visszaigazolás - ${courseName}`,
        html: confirmationHtml,
      });
    } catch (err) {
      console.error("Failed to send confirmation email:", err);
      emailErrors.push("confirmation");
    }

    if (emailErrors.length > 0) {
      return new Response(
        JSON.stringify({
          success: true,
          emailWarning: "A jelentkezést rögzítettük, de az email küldés részben sikertelen volt. Kérjük, hívjon minket: +36 30 620 7373",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
