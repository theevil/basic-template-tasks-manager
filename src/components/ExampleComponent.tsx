import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearData } from '../store/slices/exampleSlice';

export default function ExampleComponent() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector(() => {
    // Descomentar cuando el slice esté registrado en el store
    // return state.example;
    return { data: [], loading: false, error: null };
  });

  const handleClear = () => {
    dispatch(clearData());
  };

  return (
    <div>
      <h2>Redux Example Component</h2>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      
      <pre>{JSON.stringify(data, null, 2)}</pre>
      
      <button onClick={handleClear}>Clear Data</button>
    </div>
  );
}
