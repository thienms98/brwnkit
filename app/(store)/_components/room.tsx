"use client";

import Loader from "@/components/ui/loader";
import { Product } from "@/generated/prisma/client";
import { cn } from "@/lib/utils";
import { IRoom, Watcher } from "@/types/room";
import { useGSAP } from "@gsap/react";
import { Html, useGLTF } from "@react-three/drei";
import { Canvas, ThreeEvent, useThree } from "@react-three/fiber";
import { EffectComposer, Outline } from "@react-three/postprocessing";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Dispatch,
  SetStateAction,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import { Mesh, Object3D, Vector3 } from "three";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Room = ({ room }: { room: IRoom }) => {
  console.log("🚀 ~ Room ~ room:", room);
  const [isFocus, setIsFocus] = useState(false);

  return (
    <div className="flex-1 md:h-full max-sm:w-screen max-sm:aspect-video">
      <Canvas>
        <Suspense fallback={<Loader />}>
          <RoomModel room={room} isFocus={isFocus} setIsFocus={setIsFocus} />
        </Suspense>

        <ambientLight intensity={1} />

        <directionalLight position={[10, 10, 10]} intensity={2} />
      </Canvas>

      {isFocus && (
        <div
          className="fixed inset-0 z-1 w-full h-full bg-black/20 cursor-close"
          onClick={() => setIsFocus(false)}
        >
          hellu
        </div>
      )}
    </div>
  );
};

export default Room;

const normalizeWatcher = (watcher: Watcher) => ({
  px: watcher.position.x,
  py: watcher.position.y,
  pz: watcher.position.z,
  lx: watcher.lookAt.x,
  ly: watcher.lookAt.y,
  lz: watcher.lookAt.z
});

const RoomModel = ({
  room,
  isFocus,
  setIsFocus
}: {
  room: IRoom;
  isFocus: boolean;
  setIsFocus?: Dispatch<SetStateAction<boolean>>;
}) => {
  console.log("🚀 ~ RoomModel ~ room:", room);
  const { scene, nodes } = useGLTF(room.url);
  const [hoveredMesh, setHoveredMesh] = useState<Object3D | null>(null);
  const { camera } = useThree();

  const cameraRef = useRef(normalizeWatcher(room.watchers[0]));

  const animateCamera = (newCamera: typeof cameraRef.current) => {
    const proxy = cameraRef.current; // { position: {x,y,z}, lookAt: {x,y,z} }

    gsap.to(proxy, {
      ...newCamera,
      duration: 1,
      ease: "power2.inOut",
      onUpdate: () => {
        camera.position.set(proxy.px, proxy.py, proxy.pz);
        camera.lookAt(proxy.lx, proxy.ly, proxy.lz);
      }
    });
  };

  useEffect(() => {
    if (isFocus) return;

    animateCamera(normalizeWatcher(room.watchers[0]));
  }, [isFocus]);

  const spots = useMemo(() => {
    const array = new Map<
      string,
      {
        position: { [key in "x" | "y" | "z"]: number };
        product: Product;
        name: string;
      }
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
        name: roomObject.name,
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
            onClick={() => {
              console.log(key, spot);
              const watcher = room.watchers.find((i) => i.name === key);
              if (!watcher) return;

              setIsFocus?.(Boolean(watcher));
              animateCamera(normalizeWatcher(watcher));
            }}
            onMouseEnter={() => setHoveredMesh(nodes[key])}
            onMouseLeave={() => setHoveredMesh(null)}
            className={cn(
              "relative -translate-x-1/2 -top-20 cursor-pointer transition-all delay-100",
              isFocus ? "scale-0 opacity-0" : ""
            )}
          >
            <div className="whitespace-nowrap p-3 px-5 font-semibold rounded-full backdrop-blur-xs border-6 text-primary border-primary/50 transition-all hover:scale-110">
              {spot.product.title}
            </div>
          </div>
        </Html>
      ))}
      <EffectComposer autoClear={false}>
        {hoveredMesh ? (
          <Outline
            selection={hoveredMesh.children as any}
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
