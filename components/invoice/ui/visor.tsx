"use client";

export function Visor({ active }: { active: boolean }) {
  if (!active) return null;

  return (
    <>
      <span className="visor-bracket visor-tl" />
      <span className="visor-bracket visor-tr" />
      <span className="visor-bracket visor-bl" />
      <span className="visor-bracket visor-br" />
    </>
  );
}
