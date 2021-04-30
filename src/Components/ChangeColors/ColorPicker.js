import styled from 'styled-components'
import { HexColorPicker } from 'react-colorful'
import { useState, useEffect } from 'react'

const ColorPicker = (props) => {
    const [isPickerVisible, setIsPickerVisible] = useState(false)

    useEffect(()=> {
        if(isPickerVisible) {
            window.addEventListener('click', checkElement)
            window.addEventListener('focusin', checkElementFocus)
        }
        return ()=> {
            window.removeEventListener('click', checkElement)
            window.removeEventListener('focusin', checkElementFocus)
        }
        // eslint-disable-next-line
    }, [isPickerVisible])

    const checkElementFocus = (e) => {
        if(!e.target.className.includes('react-colorful__interactive') && !e.target.className.includes('react-colorful__pointer')  && e.target.id!==props.name) {
            setIsPickerVisible(false)
        }
    }

    const checkElement = (e) => {
        if(!e.target.className.includes('react-colorful__interactive') && !e.target.className.includes('react-colorful__pointer')  && e.target.id!==props.name) {
            setIsPickerVisible(false)
        }
    }

    return(
        <Picker>
            <ColorLabel aria-label={props.ariaLabel} onClick={()=>setIsPickerVisible(true)} id={props.name} color={props.color}></ColorLabel>
            <PickerLabel htmlFor='background'>{props.name}</PickerLabel>
            {isPickerVisible &&
                <ColorPickerContainer>
                    <StyledColorPicker color={props.color} onChange={props.setColor} />
                </ColorPickerContainer>
            }
        </Picker>
    )
}

export default ColorPicker


const Picker = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 105px;
`

const PickerLabel = styled.label`
`

const ColorLabel = styled.button`
    background-color: ${props=>props.color};
    height: 70px;
    width: 70px;
    border-radius: 50%;
    border: 1px solid var(--primary-text);
    box-shadow: 0;
    margin-bottom: 5px;
`

const StyledColorPicker = styled(HexColorPicker)`
    transform: scale(.7);
`

const ColorPickerContainer = styled.div`
    position: absolute;
    top: 80px;
    z-index: 100;
`