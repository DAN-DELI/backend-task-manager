/**
 * @module email-templates
 * @description Plantillas HTML para los correos transaccionales del sistema.
 * Centraliza el diseño de emails para mantener los controladores limpios.
 */

/**
 * Plantilla para el email de recuperación de contraseña.
 * @param {string} userName  - Nombre del usuario destinatario.
 * @param {string} resetLink - URL con el token de recuperación.
 * @returns {string} HTML del email listo para enviar.
 */
export const resetPasswordEmail = (userName, resetLink) => `
<div style="font-family:'Segoe UI',sans-serif; background:#f4f7f6; padding:40px;">
    <div style="background:#fff; border-radius:12px; padding:2.5rem;
                max-width:520px; margin:0 auto; box-shadow:0 4px 12px rgba(0,0,0,.08);">
        <h2 style="color:#0056b3; border-bottom:2px solid #e0e0e0; padding-bottom:1rem;">
            Recuperar contraseña
        </h2>
        <p style="color:#555; line-height:1.6;">
            Hola <strong>${userName}</strong>, recibimos una solicitud para restablecer
            tu contraseña. Haz clic en el botón (válido por <strong>1 hora</strong>):
        </p>
        <a href="${resetLink}"
            style="display:inline-block; padding:0.8rem 2rem; background:#0056b3;
                color:#fff; text-decoration:none; border-radius:6px; margin-top:1.5rem;">
            Restablecer contraseña
        </a>
        <p style="color:#999; font-size:0.8rem; margin-top:2rem;
                border-top:1px solid #e0e0e0; padding-top:1rem;">
            Si no solicitaste esto, ignora este mensaje. Tu contraseña no cambiará.
        </p>
    </div>
</div>
`;