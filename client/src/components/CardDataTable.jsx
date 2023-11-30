import React from 'react'

export default function CardDataTable({toothData}) {

    const toothCards = toothData.map(tooth => {
        return(
            <div className="tooth-card" key={tooth.tooth_number}>
                <h3>{tooth.tooth}</h3>
                <p>Condition: {tooth.disease}</p>
                <p>Confidence: {tooth.confidence}</p>
            </div>
        )
    })

    return(
        <>
            <div>{console.log(toothData)}</div>
            <div className="tooth-card-container">
                {toothCards}
            </div>
        </>
    )
}