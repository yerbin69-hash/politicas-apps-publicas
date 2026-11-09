'use strict';

(() => {
  const form = document.getElementById('deletion-form');
  const panel = document.getElementById('preview-panel');
  const preview = document.getElementById('request-preview');
  const consent = document.getElementById('share-consent');
  const openButton = document.getElementById('open-mail');
  const copyButton = document.getElementById('copy-request');
  const status = document.getElementById('form-status');
  if (!form || !panel || !preview || !consent || !openButton || !copyButton || !status) return;

  const recipient = 'yerbin@hotmail.es';
  const subject = 'IMKRO: solicitud de eliminación';
  const clean = value => String(value || '').trim().replace(/\r\n?/g, '\n');
  let currentDraft = '';
  status.textContent = 'Puedes preparar un borrador sin completar los campos opcionales. No se envía automáticamente.';

  function invalidatePreview() {
    if (!currentDraft) return;
    currentDraft = '';
    consent.checked = false;
    openButton.disabled = true;
    panel.hidden = true;
    status.textContent = 'Has cambiado los datos. Revisa de nuevo la solicitud antes de abrir el correo.';
  }

  form.addEventListener('input', invalidatePreview);
  form.addEventListener('change', invalidatePreview);
  form.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = new FormData(form);
    const username = clean(values.get('username'));
    const account = clean(values.get('account'));
    const rooms = clean(values.get('rooms'));
    const details = clean(values.get('details'));
    currentDraft = [
      'Solicito la eliminación de datos de IMKRO.',
      '',
      `Alcance: ${clean(values.get('scope'))}`,
      `Username público (opcional): ${username || 'No indicado'}`,
      `ID público de cuenta (opcional): ${account || 'No indicado'}`,
      `IDs de sala (opcionales): ${rooms || 'No indicados'}`,
      '',
      `Situación y solicitud: ${details || 'Quiero que soporte me indique los pasos para verificar la propiedad y atender mi solicitud.'}`,
      '',
      'Sé que un username público no demuestra la propiedad. Solicito una verificación segura sin enviar claves privadas, tokens, contraseñas ni invitaciones activas.',
      'Puedo iniciar esta solicitud sin tener instalada la aplicación. Entiendo que perder las credenciales puede impedir verificar la propiedad o localizar todos los recursos.',
      'Solicito información sobre el alcance de la eliminación y cualquier limpieza pendiente o conservación justificada.',
    ].join('\n');
    preview.value = currentDraft;
    consent.checked = false;
    openButton.disabled = true;
    panel.hidden = false;
    status.textContent = 'Borrador preparado en este dispositivo. Aún no se ha enviado ninguna solicitud.';
    panel.focus();
  });

  consent.addEventListener('change', () => { openButton.disabled = !consent.checked || !currentDraft; });
  openButton.addEventListener('click', () => {
    if (!consent.checked || !currentDraft) return;
    const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(currentDraft)}`;
    window.location.assign(mailto);
    status.textContent = 'Se ha solicitado abrir tu cliente de correo. Revisa el destinatario y pulsa Enviar allí. Esta página no confirma recepción ni eliminación. Si no se abre, copia el borrador en tu correo web.';
  });

  copyButton.addEventListener('click', async () => {
    if (!currentDraft) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(currentDraft);
      status.textContent = 'Borrador copiado. Pégalo en tu correo web y envíalo a yerbin@hotmail.es. Copiarlo no envía la solicitud.';
    } catch {
      preview.focus();
      preview.select();
      status.textContent = 'Seleccionamos el borrador para que puedas copiarlo manualmente. Envíalo a yerbin@hotmail.es desde tu correo. Aún no se ha enviado la solicitud.';
    }
  });
})();
