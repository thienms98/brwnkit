"use client";

import { Suspense } from "react";
import Loader from "../_components/loader";
import { Canvas } from "@react-three/fiber";
import Room from "../_components/room";
import { OrbitControls } from "@react-three/drei";

const Showcase = () => {
  return (
    <Canvas camera={{ position: [23, 6, 0] }}>
      <Suspense fallback={<Loader />}>
        <Room />
      </Suspense>

      <ambientLight intensity={1} />

      <directionalLight position={[10, 10, 10]} intensity={2} />
      <OrbitControls />
    </Canvas>
  );
};

export default Showcase;
