import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Settings, HelpCircle, MoreHorizontal, Zap } from "lucide-react";

interface MobileGameControlsProps {
  onShowCalibration: () => void;
  onShowInstructions: () => void;
  starPowerMeter: number;
  starPowerActive: boolean;
  onActivateStarPower: () => void;
}

const MobileGameControls = ({
  onShowCalibration,
  onShowInstructions,
  starPowerMeter,
  starPowerActive,
  onActivateStarPower
}: MobileGameControlsProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="md:hidden flex items-center gap-1 px-2"
        >
          <MoreHorizontal className="w-3 h-3" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-auto">
        <SheetHeader>
          <SheetTitle>Game Controls</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-4 mt-6 pb-4">
          <Button
            variant="outline"
            onClick={() => {
              onShowCalibration();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 h-12"
          >
            <Settings className="w-4 h-4" />
            Calibrate
          </Button>
          
          <Button
            variant="outline"
            onClick={() => {
              onShowInstructions();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 h-12"
          >
            <HelpCircle className="w-4 h-4" />
            Help
          </Button>

          {/* Mobile Star Power Activation */}
          <Button
            variant={starPowerActive ? "default" : "outline"}
            onClick={() => {
              if (starPowerMeter >= 50) {
                onActivateStarPower();
                setIsOpen(false);
              }
            }}
            disabled={starPowerMeter < 50}
            className="flex items-center gap-2 h-12 col-span-2"
          >
            <Zap className="w-4 h-4" />
            {starPowerActive ? "Star Power Active!" : 
             starPowerMeter >= 50 ? "Activate Star Power" : 
             `Star Power (${Math.floor(starPowerMeter)}%)`}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileGameControls;