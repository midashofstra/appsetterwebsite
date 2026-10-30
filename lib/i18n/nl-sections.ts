import { planBookMascotHostInnerHtml } from "@/lib/plan-mascot";

/** Section HTML (nl) */
export const problemHtml = `<!-- PROBLEEM -->
<section id="probleem">
  <div class="wrap">
    <div class="head rv"><div><span class="label"><i></i>Het probleem</span><!-- Legacy h2: Leads genoeg. Maar niemand die ze opvolgt. --><h2>Herken je dit?</h2></div></div>
    <div class="cards">
      <div class="card rv">
        <h3>Geen tijd om op te volgen</h3>
        <p>Handmatig opvolgen schiet erbij in. Leads blijven liggen en worden koud.</p>
      </div>
      <div class="card rv d1">
        <h3>Een setter is duur</h3>
        <p>â¬10 tot â¬50 per uur, of â¬100 per afspraak plus bonus. En een goede vind je lastig.</p>
      </div>
      <div class="card g rv d2">
        <h3>Jij bent de bottleneck</h3>
        <p>Je groei hangt af van jouw tijd, en die is op. Je voelt je meer verkoper dan ondernemer.</p>
      </div>
    </div>
  </div>
</section>`;
export const planHtml = `<!-- PLAN -->
<section id="plan">
  <div class="wrap">
    <div class="head rv">
      <div><span class="label"><i></i>Hoe het werkt</span><h2>In drie stappen een volle agenda.</h2></div>
      <a class="btn btn-ghost" href="#start">Probeer 3 dagen voor â¬1</a>
    </div>
    <div class="steps" id="steps">
      <div class="line" aria-hidden="true"><i></i></div>
      <div class="step step--connect rv">
        <span class="num">1</span>
        <h3>Koppel je kanalen</h3>
        <p>Koppel je LinkedIn, e-mail en agenda. Klaar in een paar klikken.</p>
        <div class="mini" aria-hidden="true">
          <div class="r"><!-- legacy LinkedIn mini logo: data:image/svg+xml,%3Csvg%20width%3D%227... --><img draggable="false" src="/logos/linkedin.svg" alt="">LinkedIn<span class="tag g">Gekoppeld</span></div>
          <div class="r"><img draggable="false" src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%2252%2042%2088%2066%22%3E%3Cpath%20fill%3D%22%234285f4%22%20d%3D%22M58%20108h14V74L52%2059v43c0%203.32%202.69%206%206%206%22/%3E%3Cpath%20fill%3D%22%2334a853%22%20d%3D%22M120%20108h14c3.32%200%206-2.69%206-6V59l-20%2015%22/%3E%3Cpath%20fill%3D%22%23fbbc04%22%20d%3D%22M120%2048v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2%22/%3E%3Cpath%20fill%3D%22%23ea4335%22%20d%3D%22M72%2074V48l24%2018%2024-18v26L96%2092%22/%3E%3Cpath%20fill%3D%22%23c5221f%22%20d%3D%22M52%2051v8l20%2015V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4%207.2%22/%3E%3C/svg%3E" alt="">Gmail<span class="tag g">Gekoppeld</span></div>
          <div class="r"><img draggable="false" src="data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%20200%20200%22%3E%3Cg%20transform%3D%22translate%283.75%203.75%29%22%3E%3Cpath%20fill%3D%22%23FFFFFF%22%20d%3D%22M148.882%2C43.618l-47.368-5.263l-57.895%2C5.263L38.355%2C96.25l5.263%2C52.632l52.632%2C6.579l52.632-6.579l5.263-53.947L148.882%2C43.618z%22/%3E%3Cpath%20fill%3D%22%231A73E8%22%20d%3D%22M65.211%2C125.276c-3.934-2.658-6.658-6.539-8.145-11.671l9.132-3.763c0.829%2C3.158%2C2.276%2C5.605%2C4.342%2C7.342c2.053%2C1.737%2C4.553%2C2.592%2C7.474%2C2.592c2.987%2C0%2C5.553-0.908%2C7.697-2.724s3.224-4.132%2C3.224-6.934c0-2.868-1.132-5.211-3.395-7.026s-5.105-2.724-8.5-2.724h-5.276v-9.039H76.5c2.921%2C0%2C5.382-0.789%2C7.382-2.368c2-1.579%2C3-3.737%2C3-6.487c0-2.447-0.895-4.395-2.684-5.855s-4.053-2.197-6.803-2.197c-2.684%2C0-4.816%2C0.711-6.395%2C2.145s-2.724%2C3.197-3.447%2C5.276l-9.039-3.763c1.197-3.395%2C3.395-6.395%2C6.618-8.987c3.224-2.592%2C7.342-3.895%2C12.342-3.895c3.697%2C0%2C7.026%2C0.711%2C9.974%2C2.145c2.947%2C1.434%2C5.263%2C3.421%2C6.934%2C5.947c1.671%2C2.539%2C2.5%2C5.382%2C2.5%2C8.539c0%2C3.224-0.776%2C5.947-2.329%2C8.184c-1.553%2C2.237-3.461%2C3.947-5.724%2C5.145v0.539c2.987%2C1.25%2C5.421%2C3.158%2C7.342%2C5.724c1.908%2C2.566%2C2.868%2C5.632%2C2.868%2C9.211s-0.908%2C6.776-2.724%2C9.579c-1.816%2C2.803-4.329%2C5.013-7.513%2C6.618c-3.197%2C1.605-6.789%2C2.421-10.776%2C2.421C73.408%2C129.263%2C69.145%2C127.934%2C65.211%2C125.276z%22/%3E%3Cpath%20fill%3D%22%231A73E8%22%20d%3D%22M121.25%2C79.961l-9.974%2C7.25l-5.013-7.605l17.987-12.974h6.895v61.197h-9.895L121.25%2C79.961z%22/%3E%3Cpath%20fill%3D%22%23EA4335%22%20d%3D%22M148.882%2C196.25l47.368-47.368l-23.684-10.526l-23.684%2C10.526l-10.526%2C23.684L148.882%2C196.25z%22/%3E%3Cpath%20fill%3D%22%2334A853%22%20d%3D%22M33.092%2C172.566l10.526%2C23.684h105.263v-47.368H43.618L33.092%2C172.566z%22/%3E%3Cpath%20fill%3D%22%234285F4%22%20d%3D%22M12.039-3.75C3.316-3.75-3.75%2C3.316-3.75%2C12.039v136.842l23.684%2C10.526l23.684-10.526V43.618h105.263l10.526-23.684L148.882-3.75H12.039z%22/%3E%3Cpath%20fill%3D%22%23188038%22%20d%3D%22M-3.75%2C148.882v31.579c0%2C8.724%2C7.066%2C15.789%2C15.789%2C15.789h31.579v-47.368H-3.75z%22/%3E%3Cpath%20fill%3D%22%23FBBC04%22%20d%3D%22M148.882%2C43.618v105.263h47.368V43.618l-23.684-10.526L148.882%2C43.618z%22/%3E%3Cpath%20fill%3D%22%231967D2%22%20d%3D%22M196.25%2C43.618V12.039c0-8.724-7.066-15.789-15.789-15.789h-31.579v47.368H196.25z%22/%3E%3C/g%3E%3C/svg%3E" alt="">Google Agenda<span class="tag g">Gekoppeld</span></div>
        </div>
      </div>
      <div class="step step--business rv d1">
        <span class="num">2</span>
        <!-- Legacy step 2: Vertel wie je ideale klant is — Wie wil je spreken, en waarom? -->
        <h3>Vertel over je bedrijf</h3>
        <p>Wie je bent, wie je klant is en wat je product of dienst is. Een paar regels is genoeg zodat je agent op jou klinkt.</p>
        <div class="mini" aria-hidden="true">
          <div class="r">Wie ben jij<span class="tag">Installateur, regio Rotterdam</span></div>
          <div class="r">Wat doe je<span class="tag">Warmtepompinstallaties</span></div>
          <div class="r">Je klant<span class="tag">Huiseigenaren</span></div>
          <div class="r">Wat is je aanbod<span class="tag">Advies &amp; installatie</span></div>
          <!-- Legacy 3-row mini card:
          <div class="r">Jij<span class="tag">Installateur, regio Rotterdam</span></div>
          <div class="r">Je klant<span class="tag">Huiseigenaren</span></div>
          <div class="r">Je aanbod<span class="tag">Advies &amp; installatie</span></div>
          -->
        </div>
      </div>
      <div class="step rv d2">
        <span class="num">3</span>
        <h3>Ontvang afspraken in je agenda</h3>
        <p>Gesprekken verschijnen gewoon in je agenda. Jij hoeft alleen te bellen.</p>
        <div class="mini" aria-hidden="true">
          <div class="cal"><i></i><i class="x"></i><i></i><i></i><i class="x"></i><i class="x"></i><i></i><i class="x"></i><i></i><i></i><i></i><i class="x"></i><i></i><i class="x"></i><i class="x"></i></div>
        </div>
        <div id="plan-mascot-host" class="plan-mascot-host">${planBookMascotHostInnerHtml()}</div>
      </div>
    </div>
  </div>
</section>`;
/* Legacy manifest (static HTML, no inline mascot):
export const manifestHtml = `<!-- FILOSOFISCH -->
<section class="manifest">
  <div class="wrap">
    <h2>Jouw werk is de afspraak. Alles wat daaraan voorafgaat, hoort niet op jouw bord.</h2>
  </div>
</section>`;
*/
export const footerHtml = `<footer>
  <div class="wrap">
    <a href="#top" class="brand" style="color:var(--ink);font-size:16px">
      <svg width="30" height="30" viewBox="0 0 120 120" aria-hidden="true"><rect width="120" height="120" rx="30" fill="var(--g)"/><use href="#agent" transform="rotate(-8 60 64)"/></svg>
      appointmentsetter.app
    </a>
    <div class="links"><a href="#top">Privacy</a><a href="#top">Voorwaarden</a><span>© 2026</span></div>
  </div>`;
