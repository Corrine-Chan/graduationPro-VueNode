function formatNumberToThousands(num:number):string {
    if (isNaN(num)||typeof(num)!="number") { // 判断是不是有效数字
        throw new Error("必须是一个有效数字")
    }

    const [integerPart, decimalPart] = num.toString().split(".") // 例1234.7 split切割
    
    let formatterInteger = "" //
    
    for (let i = integerPart.length - 1; i >= 0; i--){ // 倒序循环 千分位分割就是从后往前
        formatterInteger = integerPart[i] + formatterInteger // 往前拼
        if ((integerPart.length - i) % 3 === 0 && i !== 0) {
            formatterInteger = "," + formatterInteger // 例如循环到了1234.7中的2 那么在2前面加,
        }
        
    }
    // ES6知识 有小数位就拼上去 没有就是formatterInteger自己
    return decimalPart?`${formatterInteger}.${decimalPart}`:formatterInteger
}

export default formatNumberToThousands