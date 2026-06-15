import { useGLTF } from "@react-three/drei";

const Room = () => {
  const { scene, nodes } = useGLTF("/models/living_room.glb");
  console.log("🚀 ~ Room ~ nodes:", Object.keys(nodes));

  return <primitive object={scene} />;
};

export default Room;
