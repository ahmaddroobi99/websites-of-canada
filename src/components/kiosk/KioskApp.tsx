import { AttractScreen } from "./AttractScreen";
import { ArcadePad, MobileControls } from "./ArcadePad";
import { HeaderBar, SearchChip, Toast, Viewfinder } from "./Chrome";
import { MosaicCanvas } from "./MosaicCanvas";
import { SearchOverlay } from "./SearchOverlay";
import { SiteViewer } from "./SiteViewer";
import { Credit } from "./Credit";

export function KioskApp() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-bg text-fg">
      <MosaicCanvas />
      <Viewfinder />
      <HeaderBar />
      <AttractScreen />
      <SearchChip />
      <SearchOverlay />
      <SiteViewer />
      <ArcadePad />
      <MobileControls />
      <Toast />
      <Credit />
    </main>
  );
}
