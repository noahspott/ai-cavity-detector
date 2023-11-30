import React from 'react'

export default function CardDataTable({toothData}) {

    // Sort tooth data by tooth number
    let sortedToothData = [...toothData].sort((a, b) => {
        const toothA = parseInt(a.tooth.replace('Tooth ', ''), 10);
        const toothB = parseInt(b.tooth.replace('Tooth ', ''), 10);
      
        return toothA - toothB;
    });

    // Create a card for each tooth
    const toothCards = sortedToothData.map(tooth => {

        let colorClass = 'off-black'

        switch(tooth.disease) {
            case 'Caries':
                colorClass = 'caries'
                break;
            case 'Impacted':
                colorClass = 'impacted'
                break;
            case 'Deep Caries':
                colorClass = 'deep-caries'
                break;
            case 'Periapical Lesion':
                colorClass = 'periapical-lesion'
                break;
            default:
                colorClass = 'off-black'
        }

        return(
            <div className="tooth-card" key={tooth.tooth}>
                <p className="text-sm caps bold off-black">{tooth.tooth}</p>
                <p className="text-sm">Condition: <a className={`${colorClass} bold`}>{tooth.disease}</a></p>
                <p className="text-sm">Confidence: {tooth.confidence.toFixed(2)}</p>
            </div>
        )
    })

    return(
        <>
            <div className="tooth-card-container">
                {toothCards}
            </div>
        </>
    )
}