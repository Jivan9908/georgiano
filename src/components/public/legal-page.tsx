import { PublicFooter } from "./public-footer";
import { PublicHeader } from "./public-header";

type Section = { title: string; body: string[] };

export function LegalPage({ eyebrow, title, introduction, sections }: { eyebrow: string; title: string; introduction: string; sections: Section[] }) {
  return <><PublicHeader /><main className="legal-page"><header className="legal-hero"><div className="page-shell"><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p>{introduction}</p><span>Draft placeholder · not a final legal policy</span></div></header><article className="page-shell legal-layout"><aside><p>Development draft</p><span>Last reviewed: Stage 4</span><span>Final legal review required before publication.</span></aside><div className="legal-copy">{sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</section>)}</div></article></main><PublicFooter /></>;
}
