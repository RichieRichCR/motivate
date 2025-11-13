'use client';

import { usePreferences } from '@/app/provider/preferences-provider';
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Switch,
} from '@repo/ui';
import { Settings } from 'lucide-react';

export const PreferencesDialog = () => {
  const {
    theme,
    setTheme,
    weightUnit,
    setWeightUnit,
    distanceUnit,
    setDistanceUnit,
    reducedMotion,
    setReducedMotion,
  } = usePreferences();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open settings">
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Preferences</DialogTitle>
          <DialogDescription>
            Customize your Motivate experience
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Theme Selection */}
          <div className="grid gap-2">
            <Label htmlFor="theme">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Weight Unit */}
          <div className="grid gap-2">
            <Label htmlFor="weight-unit">Weight Unit</Label>
            <Select value={weightUnit} onValueChange={setWeightUnit}>
              <SelectTrigger id="weight-unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilograms (kg)</SelectItem>
                <SelectItem value="lbs">Pounds (lbs)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Distance Unit */}
          <div className="grid gap-2">
            <Label htmlFor="distance-unit">Distance Unit</Label>
            <Select value={distanceUnit} onValueChange={setDistanceUnit}>
              <SelectTrigger id="distance-unit">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="km">Kilometers (km)</SelectItem>
                <SelectItem value="miles">Miles</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reduced Motion */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reduced-motion">Reduce Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
            <Switch
              id="reduced-motion"
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
