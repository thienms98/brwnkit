import { useGLTF } from "@react-three/drei";

const Room = () => {
  const { scene } = useGLTF("/models/living_room.glb");

  return <primitive object={scene} />;
};

export default Room;
