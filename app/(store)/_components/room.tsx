"use client";

import Loader from "@/components/ui/loader";
import { Product } from "@/generated/prisma/client";
import { IRoom } from "@/types/room";
import { useGSAP } from "@gsap/react";
import { Html, useGLTF } from "@react-three/drei";
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRouter } from "next/navigation";
import { Suspense, useMemo } from "react";
import { Mesh, Vector3 } from "three";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Room = ({ room }: { room: IRoom }) => {
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

const RoomModel = ({ room }: { room: IRoom }) => {
  const { scene } = useGLTF(room.url);
  const { camera } = useThree();
  const { push } = useRouter();

  useGSAP(() => {
    const watchers = room.watchers;
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
        scrub: 1
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

  const spots = useMemo(() => {
    const array = new Map<
      string,
      { position: { [key in "x" | "y" | "z"]: number }; product: Product }
    >();
    const worldPosition = new Vector3();

    scene.traverse((object) => {
      const roomObject = room.roomObjects.find(
        (obj) => object.name === obj.name
      );
      if (!roomObject) return;
      object.getWorldPosition(worldPosition);
      const { x, y, z } = worldPosition;

      array.set(object.name, {
        position: { x, y, z },
        product: roomObject.product
      });
    });
    return array;
  }, [scene]);

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

      {Array.from(spots).map(([key, spot]) => (
        <Html
          key={key}
          position={[spot.position.x, spot.position.y, spot.position.z]}
        >
          <div
            onClick={() => push(`/products/${spot.product.slug}`)}
            className="block size-3 rounded-full bg-white -translate-x-1/2 -translate-y-1/2 ring-0 ring-white ring-offset-8 ring-offset-black/50 hover:ring-2 hover:size-2 transition-all cursor-pointer"
          ></div>
        </Html>
      ))}
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
