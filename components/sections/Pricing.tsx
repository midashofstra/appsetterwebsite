import { faCheck, faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { SiteIcon } from "@/components/icons/SiteIcon";
import { CtaButton } from "@/components/ui/CtaButton";
import { getPricingPlansForLocale } from "@/lib/pricing-plans";
import type { Dictionary } from "@/lib/i18n/types";

function formatEur(amount: number, locale: Dictionary["locale"]) {
  return new Intl.NumberFormat(locale === "nl" ? "nl-NL" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function Pricing({ dict }: { dict: Dictionary }) {
  const { pricing: p } = dict;
  const plans = getPricingPlansForLocale(dict.locale);

  return (
    <section id="pricing" className="pricing-section soft" aria-labelledby="pricing-heading">
      <div className="wrap">
        <div className="pricing-head rv">
          <h2 id="pricing-heading">{p.title}</h2>
        </div>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <article
              key={plan.id}
              className={`pricing-card rv${plan.popular ? " pricing-card--popular" : ""}${index === 1 ? " d1" : index === 2 ? " d2" : ""}`}
              data-pricing-plan={plan.id}
            >
              {plan.popular ? (
                <div className="pricing-card__tab" aria-hidden>
                  {p.mostPopular}
                </div>
              ) : null}
              <div className="pricing-card__inner">
                <header className="pricing-card__header">
                  <h3>{plan.name}</h3>
                  <p className="pricing-card__desc">{plan.description}</p>
                </header>
                <div className="pricing-card__price">
                  <span className="pricing-card__amount">{formatEur(plan.priceMonthlyEur, dict.locale)}</span>
                  <span className="pricing-card__period">{p.perMonth}</span>
                </div>
                <CtaButton
                  href="#start"
                  className={`pricing-card__cta ${plan.popular ? "btn-main" : "btn-ink"}`}
                >
                  {p.cta}
                </CtaButton>
                <p className="pricing-card__note">{p.paymentNote}</p>
                <ul className="pricing-card__features">
                  {plan.features.map((feature) => (
                    <li key={feature.text}>
                      <span className="pricing-feature-icon" aria-hidden>
                        <SiteIcon icon={faCheck} size={11} />
                      </span>
                      <span className="pricing-feature-text">{feature.text}</span>
                      {feature.info ? (
                        <span className="pricing-feature-info" title={feature.info}>
                          <SiteIcon icon={faCircleInfo} size={16} style={{ color: "var(--muted)" }} />
                          <span className="sr-only">{feature.info}</span>
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>

        {/* Pricing section footer (cancel / history / contact) — hidden per product request:
        <div className="pricing-foot rv">
          <ul className="pricing-foot__items">
            <li>
              <span className="pricing-foot-icon" aria-hidden>
                <SiteIcon icon={faCheck} size={12} />
              </span>
              {p.footer.cancelAnytime}
            </li>
            <li>
              <span className="pricing-foot-icon" aria-hidden>
                <SiteIcon icon={faCheck} size={12} />
              </span>
              {p.footer.historyIncluded}
            </li>
          </ul>
          <p className="pricing-foot__contact">
            {p.footer.needMore}{" "}
            <a href="mailto:hello@appointmentsetter.app">{p.footer.contactUs}</a>
          </p>
        </div>
        */}
      </div>
    </section>
  );
}
