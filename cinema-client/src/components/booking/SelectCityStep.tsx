import React from 'react';
import { useMovieCities } from '../../hooks';
import Spinner from '../Spinner';
import styles from './SelectCityStep.module.css';

type Props = {
    movieId: string;
    selectedCity: string | null;
    onSelect: (city:string) => void;
}

const SelectCityStep: React.FC<Props> = ({ movieId, selectedCity, onSelect}) => {
    
    const { cities, loading, error } = useMovieCities(movieId);

    if (loading) return <Spinner size='medium' />
    if (error) return <div>{error}</div> // remove for prod;

    return (
        <select className={styles.selectStyle} value={selectedCity || ""} onChange={(e) => onSelect(e.target.value)}>
            <option className={styles.selectOptionStyle} value="">Select a city</option>
            {cities.map(city => (
                <option className={styles.cityStyle} key={city} value={city}>{city}</option>
            ))}
        </select>
    );
};

export default SelectCityStep;