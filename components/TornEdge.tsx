import { TORN } from "./tornPaths";

type Variant = "A" | "B" | "C" | "D";

const VIEW: Record<Variant, number> = { A: 70, B: 64, C: 64, D: 90 };

type Props = {
  /** Qual borda rasgada usar */
  variant: Variant;
  /** Cor do papel que rasga por cima */
  color: string;
  /** Altura renderizada da borda */
  height: number;
  /** Vira a borda de cabeça para baixo (rasgo apontando para baixo) */
  flip?: boolean;
  className?: string;
  style?: React.CSSProperties;
};

export default function TornEdge({
  variant,
  color,
  height,
  flip = false,
  className,
  style,
}: Props) {
  const h = VIEW[variant];
  const path = TORN[variant];
  const specks = TORN[`${variant}S` as "AS" | "BS" | "CS" | "DS"];

  return (
    <svg
      className={className}
      aria-hidden="true"
      focusable="false"
      viewBox={`0 0 1200 ${h}`}
      preserveAspectRatio="none"
      style={{
        display: "block",
        width: "100%",
        height,
        transform: flip ? "scaleY(-1)" : undefined,
        ...style,
      }}
    >
      <g fill={color}>
        <path d={path} />
        <g dangerouslySetInnerHTML={{ __html: specks }} />
      </g>
    </svg>
  );
}
