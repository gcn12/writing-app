import styled from 'styled-components'

const CirclePlaceholder = (props) => {

    const stroke = 4
    const oldRadius = 80
    const radius = oldRadius - stroke * 2
    const circumference = radius * 2 * Math.PI
    const offset = 0

    return(
        <div>
            <svg className='progress-ring' height={oldRadius * 2} width={oldRadius*2}>
                <Cicle 
                dasharray={circumference}
                dashoffset={offset}
                strokeWidth={stroke}
                fill='transparent'
                r={radius}
                cx={oldRadius}
                cy={oldRadius}
                />
            </svg>
        </div>
    )
}

export default CirclePlaceholder

const Cicle = styled.circle`
    transform: rotate(270deg);
    transform-origin: 50% 50%;
    stroke-dasharray: ${props=>props.dasharray} ${props=>props.dasharray};
    stroke-dashoffset: ${props=>props.dashoffset};
    stroke: var(--primary-text);
    transition: stroke-dashoffset .6s ease-in-out;
`