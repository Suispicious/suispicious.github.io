import React from 'react';

const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];

const SeasonComponent = ({ activeRule, gameRules, specialRules, handleActivate }) => {
    const season = seasons[gameRules.current];
    const rules = [
        specialRules[gameRules.rules[0]],
        specialRules[gameRules.rules[1]],
        specialRules[gameRules.rules[2]],
        specialRules[gameRules.rules[3]]
    ]

    const renderActiveRule = (season, rule) => {
        if (rule.passive && !activeRule) {
            handleActivate(rule.id);
        }

        return (
            <div>
                <strong>{season}: {rule.name} - {rule.description}</strong>
                {rule.passive || activeRule ? null : <button onClick={() => handleActivate(rule.id)}>Activate</button>}
            </div>
        );
    }

    return (
        <div>
            <h2>Current Season: {season}</h2>
            <h3>Season Rules:</h3>
            <ul>
                {seasons.map((season, index) => (
                    <li key={season}>
                        {gameRules.current === index ?
                            renderActiveRule(season, rules[index]) :
                            (
                                <span>{season}: {rules[index].name} - {rules[index].description}</span>
                            )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SeasonComponent;