import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";

function DogBreeds() {
  return (
    <ul>
      <Suspense fallback={<li>Loading...</li>}>
        <DogList />
      </Suspense>
    </ul>
  );
}

function DogList() {
  const { data: breeds } = useQuery({
    queryKey: ["dogBreeds"],
    queryFn: async () => {
      const response = await fetch("https://dog.ceo/api/breeds/list/all");
      const data = await response.json();
      return Object.keys(data.message);
    },
    suspense: true,
  });

  return breeds.map((breed) => <li key={breed}>{breed}</li>);
}

export default DogBreeds;
