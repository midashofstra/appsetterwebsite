/** Legacy inbox / app-screen demo (hidden; restore via HeroDemoStage in Hero.tsx). */
export const HERO_STAGE_LEGACY_HTML = `<div class="stage hero-hide">
      <svg class="mascot-float" viewBox="0 0 120 120" aria-hidden="true"><use href="#agent"/></svg>
      <div class="app" role="img" aria-label="Voorbeeld van de inbox: de agent plant een afspraak via WhatsApp">
        <aside class="side">
          <h4>Gesprekken</h4>
          <div class="row on"><span class="av">S</span><div><b>Sanne de Vries</b><small>WhatsApp</small></div><span class="tag g">Nu</span></div>
          <div class="row"><span class="av">J</span><div><b>Jeroen Bakker</b><small>LinkedIn</small></div><span class="tag">Gepland</span></div>
          <div class="row"><span class="av">M</span><div><b>Mila Jansen</b><small>E-mail</small></div><span class="tag">Opvolgen</span></div>
          <div class="row"><span class="av">T</span><div><b>Thomas Visser</b><small>LinkedIn</small></div><span class="tag">Gepland</span></div>
        </aside>
        <div class="main">
          <div class="chat-top">
            <div class="who"><span class="av">S</span><div><b>Sanne de Vries</b><small>via WhatsApp</small></div></div>
            <span class="live"><i></i>Agent actief</span>
          </div>
          <div class="msg in">Klinkt interessant. Wanneer kunnen we even bellen?</div>
          <div class="typing" aria-hidden="true"><i></i><i></i><i></i></div>
          <div class="msg out">Leuk! Past donderdag 10:00 of vrijdag 14:30 je beter?</div>
          <div class="msg in">Donderdag 10:00 is top.</div>
          <div class="msg out">Staat erin. Je krijgt zo een uitnodiging in je mail.</div>
        </div>
      </div>
      <div class="booked">
        <span class="ok"><svg width="20" height="20" style="color:#151613"><use href="#check"/></svg></span>
        <div><b>Afspraak ingepland</b><span>Do 10:00, kennismaking met Sanne</span></div>
      </div>
    </div>`;
