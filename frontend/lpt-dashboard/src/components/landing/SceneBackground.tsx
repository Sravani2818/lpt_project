/** Animated aurora, perspective grid, and floating orbs */
export function SceneBackground() {
  return (
    <div className="scene-bg" aria-hidden>
      <div className="scene-bg__grid" />
      <div className="scene-bg__aurora scene-bg__aurora--1" />
      <div className="scene-bg__aurora scene-bg__aurora--2" />
      <div className="scene-bg__aurora scene-bg__aurora--3" />
      <div className="scene-bg__orb scene-bg__orb--1" />
      <div className="scene-bg__orb scene-bg__orb--2" />
      <div className="scene-bg__orb scene-bg__orb--3" />
      <div className="scene-bg__vignette" />
      <div className="scene-bg__scanlines" />
    </div>
  );
}
