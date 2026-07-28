# Design System — vaulk.com

> Engenharia reversa do site da Vaulk (abrigos modulares CBRN). Estética **técnica / industrial / cinematográfica**: fundo quase-preto, tipografia grotesca + mono, grid de blueprint com cantos recortados, numeração técnica (001/002/003) e — a alma do site — uma **experiência WebGL com scroll-scrub** (a câmera mergulha da estrutura pra dentro do terreno). É daí que vem a "modernidade".
> Stack real: **Nuxt (Vue) + Lenis + Three.js/WebGL**.

---

## 1. Stack técnica
| Camada | Tecnologia | Evidência |
|---|---|---|
| Framework | **Nuxt (Vue)** | bundle `/_nuxt/*.js` |
| Smooth scroll | **Lenis** | classe `lenis lenis-stopped` no `<html>` |
| Animação hero ⭐ | **Three.js / WebGL** | `<canvas>`, cena 3D scroll-scrubbed |
| Reveal/scroll motion | scroll-driven (provável GSAP-like / Vue motion) | seções pinned, painéis técnicos |

## 2. Cores
| Papel | Hex | Uso |
|---|---|---|
| Background | `#0E0F0F` | quase-preto (base) |
| Black | `#000000` | superfícies/contraste |
| White | `#FFFFFF` | texto primário |
| Light gray | `#C8CDC9` | texto secundário |
| Mid gray | `#585B5D` / `#8B8E8F` | labels, bordas |
| Off-white panel | `#ECEEED` | painéis claros alternados |
| **Accent** | `#F4682B` (laranja) | CTAs, indicadores, detalhes — *na EMEA vira vinho/bordô* |

Overlays: `rgba(14,15,15,.7)` (scrims), grid de linhas finas `rgba(65,65,65,.4)`.

## 3. Tipografia
| Papel | Fonte | Peso |
|---|---|---|
| **Display / títulos** | **Telegraf** | 500 |
| **Mono / técnica** | **Chivo Mono** | labels, números 001/002, specs, eyebrows |

Escala: h1 ~57px / h2–h3 ~36px / corpo ~13–16px. Tracking normal. Eyebrows e specs sempre em **Chivo Mono UPPERCASE** (ex.: `CORE CONCEPT`, `SYSTEM CAPABILITIES`, `OPERATIONAL USE CASE_ 001/005`).

## 4. Linguagem visual (assinatura)
- **Grid de blueprint**: linhas finas e **cantos recortados** (crop marks ┐ └ ┌ ┘) emoldurando seções — cara de desenho técnico/CAD.
- **Numeração técnica**: tudo indexado (`001`, `002`, `_001/005`) em mono.
- **Formas chanfradas**: navbar e botões com cantos cortados (clip-path), estética "militar/industrial".
- **Painéis alternados** claro/escuro com texto técnico em colunas.
- **Acento pontual** (laranja no original; vinho na EMEA).

## 5. Animações ⭐ (o que traz a modernidade)
| Animação | Técnica | Onde |
|---|---|---|
| **Mergulho WebGL no scroll** | Three.js: câmera scrub da exterior → interior/subsolo, controlada pelo progresso do scroll (Lenis) | hero |
| **Scroll-scrub cinematográfico** | timeline amarrada ao scroll (camera path, opacidade, profundidade) | hero → transição |
| **Grid + glow reveal** | grid fade-in + brilho do acento subindo | transição pós-hero |
| **Sticky feature reveal** | seções pinadas trocando specs/imagens (UHPC shell, door, ventilation…) | system capabilities |
| **Numbered process** | passos 001→003 revelando em sequência (timeline de logística) | processo/logística |
| **Use-case matrix** | painéis numerados (001/005…) com pin + troca | use cases |
| **Smooth scroll** | Lenis (inércia) dirigindo todos os triggers | global |
| **Crop-mark draw-in** | cantos do grid "desenhando" na entrada | seções técnicas |

**Como reproduzir o mergulho sem WebGL pesado:** a forma mais viável é uma **sequência de imagens (frames) ou um vídeo renderizado** do flythrough, *scrubbado* pelo scroll (técnica estilo Apple) — bem mais barato que Three.js puro e visualmente quase idêntico. Three.js fica como opção avançada.

## 6. Mapa de seções (para adaptar)
1. **Hero** — mergulho WebGL + headline + navbar chanfrada + `SCROLL TO EXPLORE`.
2. **Core concept / capabilities** — features técnicas em sticky reveal.
3. **Material/stats** — métricas (BLAST/BALLISTIC/ABRASION) em painéis.
4. **Specs técnicas** — dimensões/módulos em mono + grid.
5. **Processo (001→003)** — timeline numerada.
6. **Protection matrix** — painéis técnicos com crop marks.
7. **Use cases (001/005…)** — setores, numerados e pinados.
8. **FAQ** — acordeão técnico.
9. **Contato** — form (toggle Pro/Privado) + endereço.
10. **Footer**.

## 7. Tokens (cola)
```css
:root{
  --bg:#0E0F0F; --ink:#000; --white:#FFF;
  --gray-1:#C8CDC9; --gray-2:#585B5D; --panel:#ECEEED;
  --accent:#F4682B; /* EMEA: trocar por vinho/bordô */
  --font-display:"Telegraf",sans-serif; --font-mono:"Chivo Mono",monospace;
  --grid-line:rgba(65,65,65,.4);
  /* assinaturas: crop-marks nos cantos, numeração mono, scroll-scrub WebGL/sequência */
}
```
