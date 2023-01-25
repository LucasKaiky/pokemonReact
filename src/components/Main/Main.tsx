import { useState, useEffect } from 'react';


interface PokemonData {
    name: string;
    id: number;
    types: [{ type: { name: string } }];
    abilities: [{ ability: { name: string } }];
}


const Main = () => {
    const [pokemons, setPokemons] = useState<PokemonData[]>([]);
    const [offset, setOffset] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const limit = 21;
    const offLimit = 0;
    const [selectedPokemonId, setSelectedPokemonId] = useState<number | null>(null);
    const baseUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=`;
    
    useEffect(() => {
        setIsLoading(true);
        fetch(baseUrl + offset)
            .then((response) => response.json())
            .then((data) => {
                let pokemonsData = data.results;
                let newPokemons: PokemonData[] = [];
                pokemonsData.forEach(async (pokemon: any, index: any) => {
                let response = await fetch(pokemon.url);
                let data = await response.json();

            newPokemons.push({
                name: data.name,
                id: data.id,
                types: data.types,
                abilities: data.abilities,
            });

            if (index === pokemonsData.length - 1) {
                setPokemons((prevPokemons) => [...prevPokemons.slice(-limit), ...newPokemons]);
                setIsLoading(false);
            }

        }); 

    });
    }, [offset]);

    const sortedPokemons = pokemons.slice(-limit).sort((a, b) => a.id - b.id);

    function handleShowAbilities(pokemonId: number) {
        setSelectedPokemonId(pokemonId === selectedPokemonId ? null : pokemonId);
    }
    
    return (
<div>

    <div className='pokemonis'>
        {sortedPokemons.map((pokemon, index) => (
            
        <div className='pokemons' key={index}>

                <div className="pokemon" data-pokemon-id={pokemon.id}>

                    <img
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`}
                    alt={pokemon.name}
                    className="imagem"
                    />
                    <p className="nome">Name: {pokemon.name}</p>
                    <p className="id">ID: {pokemon.id}</p>
                    <p className="tipo">Type: {pokemon.types[0].type.name}</p>

                        <div>
                        <button className="show-abilities" onClick={() => handleShowAbilities(pokemon.id)}>
                            Mostrar habilidades
                        </button>

                                {selectedPokemonId === pokemon.id && (
                                    <div className="abilities">
                                        <ul>
                                            {pokemon.abilities.map((ability) => (
                                                <li key={ability.ability.name}>{ability.ability.name}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                        </div>

                </div>

        </div>
    ))}
    </div>

    <div className="load-more">

        {!isLoading && (
            <button className='load-more-btn' onClick={() => {
                setOffset(offset + limit);
                window.scrollTo({ top: 0, behavior: 'smooth' });}}
            >
                    Proximo
            </button>

        )
        }
        {isLoading && <p>Carregando...</p>}
        
        {
            offset != offLimit && (
            <button className='load-more-btn'
                onClick={() => {
                    setOffset(offset - limit)
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                        if (offset <= 0){
                            setOffset(offset)
                            console.log("Esta é a primeira página!")
                        }
                    }
                }
            >
                Anterior
            </button>
        )}

    </div>

</div>

    );
};

export default Main;