import React from 'react'

export default function Xray(props) {

    // Let's assume we get a JSON object  from props
    // that contains the model output
    // we can parse that data and generate the appropriate number of 
    // p-tags to display the x-ray analysis info

    // props
    //      xrayImage - link to xray image from model
    //      xrayData - data produced by model 

    return(
        <div id='xray-container'>
            {props.processedImageUrl && <img id='xray-image' src={"data:image/png;base64, " + props.processedImageUrl} alt="processed image" />}
            {/* {
                props.tableData &&
                <div>
                    <table>
                        <tr>
                            <th>Tooth Name</th>
                            <th>Disease</th>
                            <th>IOU</th>
                        </tr>
                        {tableData.map((val, key) => {
                            return (
                                <tr key={key}>
                                    <td>{val.name}</td>
                                    <td>{val.age}</td>
                                    <td>{val.gender}</td>
                                </tr>
                            )
                        })}
                    </table>
                </div>
            } */}
        </div>
    )
}