import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useField } from '@unform/core'
import { Container, Error } from './styles'


const Input = ({ name, icon, ...rest }) => {
    const inputRef = useRef()
    const [isFocused, setIsFocused] = useState(false)
    const [isFilled, setIsFilled] = useState(false)
    const [isMouseEnter, setIsMouseEnter] = useState(false)
    const { fieldName, defaultValue, error, registerField } = useField(name)


    const handleInputFocus = useCallback(() => {
        setIsFocused(true)
    }, [])

    const handleMouseEnter = useCallback(() => {
        setIsMouseEnter(true)
    }, [])

    const handleMouseLeave = useCallback(() => {
        setIsMouseEnter(false)
    }, [])

    const handleInputBlur = useCallback(() => {
        setIsFocused(false);

        setIsFilled(!!inputRef.current?.value)

    }, [])

    useEffect(() => {
        registerField({
            name: fieldName,
            ref: inputRef,
            getValue: ref => {
                return ref.current.value
            },
            setValue: (ref, value) => {
                ref.current.value = value
            },
            clearValue: ref => {
                ref.current.value = ''
            },
        })
    }, [fieldName, registerField])

    return (
        <Container isErrored={!!error} isFocused={isFocused} isFilled={isFilled}>
            {icon && <span className={icon} style={{ fontSize: 20 }}></span>}
            <input
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                name={name}
                ref={inputRef}
                type="text"
                defaultValue={defaultValue}
                className={icon}
                {...rest}
            />
            
            {error &&
                <Error isMouseEnter={isMouseEnter} title={error}>
                    <span onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className='mdi mdi-alert-circle-outline' style={{color: '#c53030',fontSize: 20}}></span>
                </Error>
            }
        </Container>
    )
}

export default Input;