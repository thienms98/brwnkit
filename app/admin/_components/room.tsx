"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { useRoom } from "@/store/room";
import { useGLTF } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { useEffect } from "react";
import { Mesh } from "three";
import { EffectComposer, Outline } from "@react-three/postprocessing";

const Room = () => {
  const { scene } = useGLTF("/models/white_modern_living_room.glb");
  const setObjects = useRoom((state) => state.setObjects);
  const selectedMesh = useRoom((state) => state.selectedMesh);
  const setSelectedMesh = useRoom((state) => state.setSelectedMesh);

  const { setOpen } = useSidebar();

  useEffect(() => {
    setOpen(false);

    const meshes: Mesh[] = [];
    scene.traverse((obj) => {
      const mesh = obj as unknown as Mesh;
      if (mesh.isMesh) {
        meshes.push(mesh);
      }
    });
    setObjects(meshes);
  }, [scene]);

  return (
    <>
      <primitive
        object={scene}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          const mesh = e.object as unknown as Mesh;
          if (!mesh.isMesh) return;
          console.log("🚀 ~ Room ~ mesh:", mesh);
          setSelectedMesh(mesh);
        }}
      />
      <EffectComposer autoClear={false}>
        {selectedMesh ? (
          <Outline
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            selection={selectedMesh as any}
            edgeStrength={10}
            blur
            visibleEdgeColor={0xffffff}
            hiddenEdgeColor={0xffffff}
          />
        ) : (
          <></>
        )}
      </EffectComposer>
    </>
  );
};

export default Room;
