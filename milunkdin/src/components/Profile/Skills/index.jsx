import ReactWordcloud from "react-wordcloud";

export default ({ skills }) => {
    return (
        <ReactWordcloud
            words={skills}
            options={{
                rotationAngles: [0, 0], rotations: 2, colors:
                    ["#001219","#005F73", "#0A9396","#EE9B00","#CA6702","#BB3E03","#AE2012","#9B2226"]
            }}
        />
    );
};
