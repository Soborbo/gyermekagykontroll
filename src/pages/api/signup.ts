import type { APIRoute } from "astro";
import { signupSchema } from "../../lib/schema";
import { Resend } from "resend";

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

    // Build email HTML
    const emailHtml = `
      <h2>Új jelentkezés érkezett!</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Tanfolyam</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${courseName}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Időpont</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.courseDate}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Osztály</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.grade}</td></tr>
        ${data.parentAttends ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Szülő részt vesz</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.parentAttends}</td></tr>` : ""}
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Résztvevő neve</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.childName}</td></tr>
        ${data.successSubject ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Sikeres tantárgy</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.successSubject}</td></tr>` : ""}
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Különleges figyelem</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.specialAttention}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Pszichiátriai kezelés</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.psychiatricTreatment}</td></tr>
        ${data.specialAttentionReason ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Különleges figyelem oka</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.specialAttentionReason}</td></tr>` : ""}
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Kedvezmény</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${discountName}</td></tr>
        ${data.photoConsent ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Fotó hozzájárulás</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.photoConsent}</td></tr>` : ""}
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Szülő neve</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.parentName}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.parentEmail}</td></tr>
        <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Telefon</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.parentPhone}</td></tr>
        ${data.message ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Üzenet</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${data.message}</td></tr>` : ""}
      </table>
    `;

    const confirmationHtml = `
      <h2>Köszönjük a jelentkezést!</h2>
      <p>Kedves ${data.parentName}!</p>
      <p>Jelentkezését megkaptuk a(z) <strong>${courseName}</strong> tanfolyamra, a következő időpontra: <strong>${data.courseDate}</strong>.</p>
      <p>A résztvevő neve: <strong>${data.childName}</strong></p>
      <p><strong>Fontos:</strong> A jelentkezés nem kötelező érvényű, nincs szükség fizetésre a jelentkezéshez. Hamarosan visszajelzünk emailben a részletekkel, és telefonon is felvesszük Önnel a kapcsolatot.</p>
      <p>Ha bármilyen kérdése van, forduljon hozzánk bizalommal:</p>
      <ul>
        <li>Telefon: +36 30 620 7373</li>
        <li>Email: info@gyermekagykontroll.hu</li>
      </ul>
      <p>Üdvözlettel,<br/>Tihanyi Rita<br/>Gyermekagykontroll oktató</p>
    `;

    // Send emails via Resend
    const resendApiKey = import.meta.env.RESEND_API_KEY;

    if (resendApiKey) {
      const resend = new Resend(resendApiKey);

      // Email to Rita
      await resend.emails.send({
        from: "Gyermekagykontroll <noreply@gyermekagykontroll.hu>",
        to: "info@gyermekagykontroll.hu",
        subject: `Új jelentkezés: ${data.childName} - ${courseName}`,
        html: emailHtml,
        replyTo: data.parentEmail,
      });

      // Confirmation email to parent
      await resend.emails.send({
        from: "Gyermekagykontroll <noreply@gyermekagykontroll.hu>",
        to: data.parentEmail,
        subject: `Jelentkezés visszaigazolás - ${courseName}`,
        html: confirmationHtml,
      });
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
