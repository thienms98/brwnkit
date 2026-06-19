"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import Loader from "@/components/ui/loader";
import { Room as RoomType } from "@/generated/prisma/client";
import { useGLTF } from "@react-three/drei";
import { ThreeEvent, useThree } from "@react-three/fiber";
import { Mesh } from "three";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Watcher } from "@/store/watcher";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Room = ({ room }: { room: RoomType }) => {
  console.log("🚀 ~ Room ~ room:", room);
  return (
    <Canvas className="flex-1">
      <Suspense fallback={<Loader />}>
        <RoomModel room={room} />
      </Suspense>

      <ambientLight intensity={1} />

      <directionalLight position={[10, 10, 10]} intensity={2} />
    </Canvas>
  );
};

export default Room;

const RoomModel = ({ room }: { room: RoomType }) => {
  const { scene } = useGLTF(room.url);
  const { camera } = useThree();

  useGSAP(() => {
    const watchers = room.watchers as unknown as Watcher[];
    if (watchers.length < 2) return;

    camera.position.set(
      watchers[0].position.x,
      watchers[0].position.y,
      watchers[0].position.z
    );
    camera.lookAt(
      watchers[0].lookAt.x,
      watchers[0].lookAt.y,
      watchers[0].lookAt.z
    );

    const proxy = {
      px: watchers[0].position.x,
      py: watchers[0].position.y,
      pz: watchers[0].position.z,
      lx: watchers[0].lookAt.x,
      ly: watchers[0].lookAt.y,
      lz: watchers[0].lookAt.z
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: `+=${(watchers.length - 1) * 1000}`,
        scrub: 1,
        markers: true
      }
    });

    watchers.slice(1).forEach((watcher) => {
      tl.to(proxy, {
        px: watcher.position.x,
        py: watcher.position.y,
        pz: watcher.position.z,
        lx: watcher.lookAt.x,
        ly: watcher.lookAt.y,
        lz: watcher.lookAt.z,
        duration: 1,
        ease: "power2.inOut",
        onUpdate: () => {
          camera.position.set(proxy.px, proxy.py, proxy.pz);
          camera.lookAt(proxy.lx, proxy.ly, proxy.lz);
        }
      });
    });
  }, []);

  return (
    <>
      <primitive
        object={scene}
        onClick={(e: ThreeEvent<MouseEvent>) => {
          e.stopPropagation();
          const mesh = e.object as unknown as Mesh;
          if (!mesh.isObject3D) return;
        }}
      />
      {/* <EffectComposer autoClear={false}>
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
      </EffectComposer> */}
    </>
  );
};
