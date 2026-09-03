import { useEffect } from "react";
import { AttractScreen } from "./AttractScreen";
import { ArcadePad, MobileControls } from "./ArcadePad";
import {
  ClusterLegend,
  EraRail,
  FocusCaption,
  HeaderBar,
  HeatToggle,
  MiniMap,
  SearchChip,
  Toast,
  Viewfinder,
  VisitedDock,
} from "./Chrome";
import { ExhibitLab } from "./ExhibitLab";
import { MosaicCanvas } from "./MosaicCanvas";
import { SearchOverlay } from "./SearchOverlay";
import { SiteViewer } from "./SiteViewer";
import { Credit } from "./Credit";
import { useKiosk } from "@/store/kiosk-store";

export function KioskApp() {
  const applyHash = useKiosk((s) => s.applyHash);

  useEffect(() => {
    applyHash();
    const onHash = () => useKiosk.getState().applyHash();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, [applyHash]);

  return (
    <main className="relative h-dvh w-full overflow-hidden bg-bg text-fg">
      <MosaicCanvas />
      <Viewfinder />
      <FocusCaption />
      <HeaderBar />
      <EraRail />
      <HeatToggle />
      <AttractScreen />
      <MiniMap />
      <ClusterLegend />
      <VisitedDock />
      <SearchChip />
      <SearchOverlay />
      <ExhibitLab />
      <SiteViewer />
      <ArcadePad />
      <MobileControls />
      <Toast />
      <Credit />
    </main>
  );
}
