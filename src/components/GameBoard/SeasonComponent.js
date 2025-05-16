const seasons = ['Spring', 'Summer', 'Fall', 'Winter'];

const SeasonComponent = ({ chess, activeRule, gameRules, specialRules, handleActivate }) => {
    const moveNumber = chess.moveNumber()
    const seasonNumber = Math.floor(moveNumber / 2) % 4;
    const season = seasons[seasonNumber];

    const rules = [
        specialRules[gameRules[0]],
        specialRules[gameRules[1]],
        specialRules[gameRules[2]],
        specialRules[gameRules[3]]
    ]

    const renderActiveRule = (season, rule) => {
        if (activeRule && activeRule.id !== rule.id) {
            handleActivate(null);
        }

        if (rule.passive && !activeRule) {
            handleActivate(rule.id);
        }

        return (
            <div>
                <strong>{season}: {rule.name} - {rule.description}</strong>
                {!rule.passive && !activeRule ? <button onClick={() => handleActivate(rule.id)}>Activate</button> : null}
                {!rule.passive && activeRule ? <button onClick={() => handleActivate(null)}>Deactivate</button> : null}
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
                        {seasonNumber === index ?
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