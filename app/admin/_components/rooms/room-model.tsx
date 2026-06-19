"use client";

import { useSidebar } from "@/components/ui/sidebar";
import { Room } from "@/generated/prisma/client";
import { useRoom } from "@/store/room";
import { useWatcher } from "@/store/watcher";
import { useGLTF } from "@react-three/drei";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import { useEffect } from "react";
import { Mesh, Object3D } from "three";

const RoomModel = ({ room }: { room: Room }) => {
  const { scene } = useGLTF(room.url);
  const { camera } = useThree();
  const setObjects = useRoom((state) => state.setObjects);
  const selectedMesh = useRoom((state) => state.selectedMesh);
  const setSelectedMesh = useRoom((state) => state.setSelectedMesh);
  const watcher = useWatcher((state) => state.activeWatcher);

  // const { setOpen } = useSidebar();

  useEffect(() => {
    // setOpen(false);

    const objects: Object3D[] = [];
    scene.traverse((obj) => {
      console.log(obj.name);
      const object = obj as unknown as Object3D;
      if (
        obj !== scene &&
        obj.name &&
        obj.children.some((child) => (child as unknown as Mesh).isMesh)
      ) {
        objects.push(object);
      }
    });
    setObjects(objects);
  }, [scene, setObjects]);

  useEffect(() => {
    if (!watcher) return;

    const { position, lookAt } = watcher;
    camera.position.set(position.x, position.y, position.z);
    camera.lookAt(lookAt.x, lookAt.y, lookAt.z);
  }, [camera, watcher]);

  return (
    <>
      <primitive
        object={scene}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          const mesh = e.object as unknown as Mesh;
          if (!mesh.isObject3D) return;
          console.log("🚀 ~ Room ~ mesh:", mesh);
          setSelectedMesh(mesh.parent);
        }}
      />
      <EffectComposer autoClear={false}>
        {selectedMesh ? (
          <Outline
            selection={selectedMesh.children as any}
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

export default RoomModel;
