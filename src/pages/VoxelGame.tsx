import React, { useEffect } from "react";
import VoxelWorld from "@/components/voxel/VoxelWorld";

const VoxelGame = () => {
  useEffect(() => {
    document.title = "Voxel AI Quest – Minecraft-like";
  }, []);

  return (
    <main className="min-h-screen">
      <VoxelWorld />
    </main>
  );
};

export default VoxelGame;
