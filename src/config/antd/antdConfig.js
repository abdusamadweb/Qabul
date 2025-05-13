
export const antdConfig = () => {

    return {
        token: {
            fontFamily: "Poppins",
            colorPrimary: '#0063F2',
            colorText: '#222222',
        },
        components: {
            Input: {
                fontSize: 16,
                paddingBlock: 8,
                paddingInline: 16,
                borderRadius: 10,
            },
            InputNumber: {
                fontSize: 16,
                paddingBlock: 8,
                paddingInline: 16,
                borderRadius: 10,
            },
            Button: {
                borderRadius: 10,
            },
            Menu: {
                iconSize: 16,
            },
            Tooltip: {
                colorBgSpotlight: '#222222dd'
            }
        }
    }
}