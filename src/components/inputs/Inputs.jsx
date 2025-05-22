import React from "react";
import {IMaskInput} from "react-imask";
import IMask from "imask";

export const PhoneInput = React.forwardRef(({ value, onChange }, ref) => {
    return (
        <IMaskInput
            className='inp-mask'
            type="tel"
            mask="+998 00 000 00 00"
            lazy={false} // Показывает маску сразу
            placeholder="-"
            unmask={true} // Передает "чистый" номер в Form
            value={value} // Связывает с Form
            onAccept={onChange} // Передает изменения в Form
            inputRef={ref} // Ant Design ожидает, что ref будет передан в Input
        />
    )
})

export const PassportInput = React.forwardRef(({ value, onChange }, ref) => {
    return (
        <IMaskInput
            className='inp-mask'
            mask="aa 0000000" // Две буквы и 7 цифр
            definitions={{
                a: /[a-zA-Z]/, // Разрешаем и строчные, и заглавные буквы
                0: /[0-9]/, // Только цифры
            }}
            lazy={false} // Показывает маску сразу
            unmask={true} // Передает "чистое" значение в Form
            value={value}
            onAccept={(val) => onChange(val.toUpperCase())}
            inputRef={ref}
        />
    );
})

export const JshInput = React.forwardRef(({ value, onChange }, ref) => {
    return (
        <IMaskInput
            className='inp-mask'
            mask="00000000000000" // Две буквы и 14 цифр
            definitions={{
                0: /[0-9]/, // Только цифры
            }}
            lazy={false} // Показывает маску сразу
            unmask={true} // Передает "чистое" значение в Form
            value={value}
            onAccept={onChange}
            inputRef={ref}
        />
    );
})

export const BirthDateInput = React.forwardRef(({ value, onChange }, ref) => {
    return (
        <IMaskInput
            className='inp-mask'
            type='tel'
            mask="0000-00-00" // Формат YYYY-MM-DD
            blocks={{
                0: {
                    mask: IMask.MaskedRange,
                    from: 0,
                    to: 9,
                },
            }}
            lazy={false} // Показывает маску сразу
            placeholder="yyyy-mm-dd"
            unmask={false}
            value={value}
            onAccept={onChange} // Обновляет значение в Form
            inputRef={ref}
        />
    );
})