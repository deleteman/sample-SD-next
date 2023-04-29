

const modelVersion = "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf"

export default async function handler(req, res) {
    let response = "";
   
    let inputObj = { 
        prompt: req.body.prompt,
        guidance_scale: 7,
        num_outputs: 1,
    }
    
    console.log("Doing prediction with this data:")
    console.log(inputObj)

    try {
        response = await fetch("https://api.replicate.com/v1/predictions", {
            method: "POST",
            headers: {
                Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                // Pinned to a specific version of Stable Diffusion
                // See https://replicate.com/stability-ai/stable-diffussion/versions
                version: modelVersion,
                
                // This is the text prompt that will be submitted by a form on the frontend
                input: inputObj,
            }),
        });
    
    } catch (err) {
        console.error("Error sending request to Replicate")
        console.log(err)
        res.statusCode = 500;
        return res.end(JSON.stringify({ detail: err.detail }));
    }

    if (response.status !== 201) {
        let error = await response.json();
        res.statusCode = 500;
        res.end(JSON.stringify({ detail: error.detail }));
        return;
    }

    const prediction = await response.json();

    res.statusCode = 201;
    res.end(JSON.stringify(prediction));
}