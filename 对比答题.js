//进行读取 TXT 文件内容读取 TXT 文件内容
function readTxtFile(filePath) {
    console.log(`尝试读取文件: ${filePath}`);
    if (files.exists(filePath)) {
        console.log(`文件 ${filePath} 存在，开始读取`);
        return files.read(filePath);
    };
    console.log(`文件 ${filePath} 不存在`);
    return null;
}

//

// 写入 TXT 文件内容
function writeTxtFile(filePath, content) {
    if (files.write(filePath, content)) {
        log(`成功写入文件 ${filePath}`);
    } else {
        log(`写入文件 ${filePath} 失败`);
    }
}

// 提取题目和答案// 提取题目和答案
// 提取题目和答案
// 提取题目和答案
function extractQuestionAndAnswer(fileContent) {
    const questions = [];
    // 使用 RegExp 构造函数创建正则表达式
    const regex = new RegExp('(\\d+)(、|.)(.*?)(?=\\d+、|\\d+\\.|$)', 'gs');
    let match;
    while ((match = regex.exec(fileContent)) !== null) {
        const questionText = match[3].trim();
        const answerMatch = questionText.match(/我的答案：([A-E])/);
        const answer = answerMatch ? answerMatch[1] : '';
        const cleanQuestion = answerMatch ? questionText.replace(/我的答案：([A-E])/, '').trim() : questionText;
        questions.push({
            number: match[1],
            separator: match[2],
            question: cleanQuestion,
            answer: answer
        });
    }
    return questions;
}
// 计算两个字符串的相似度。
function similarity(s1, s2) {
    let longer = s1;
    let shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    const longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}

// 计算两个字符串的编辑距离
function editDistance(s1, s2) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    const costs = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else {
                if (j > 0) {
                    let newValue = costs[j - 1];
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                };
            };
        }
        if (i > 0) {
            costs[s2.length] = lastValue;
        }
    }
    return costs[s2.length];
}

// 主函数，对比两个文件并写入答案
function compareAndWriteAnswers(txt1Path, txt2Path) {
    const txt1Content = readTxtFile(txt1Path);
    const txt2Content = readTxtFile(txt2Path);

    if (!txt1Content || !txt2Content) {
        return;
    }

    const txt1Questions = extractQuestionAndAnswer(txt1Content);
    const txt2Questions = extractQuestionAndAnswer(txt2Content);

    let newTxt1Content = '';
    for (let txt1Question of txt1Questions) {
        let bestMatch = null;
        let bestSimilarity = 0;
        for (let txt2Question of txt2Questions) {
            const sim = similarity(txt1Question.question, txt2Question.question);
            if (sim > bestSimilarity) {
                bestSimilarity = sim;
                bestMatch = txt2Question;
            }
        }

        if (bestMatch && bestSimilarity > 0.8) { // 相似度阈值设为 0.8
            newTxt1Content += `我的答案：${bestMatch.answer}\n${txt1Question.number}${txt1Question.separator}${txt1Question.question}\n`;
        } else {
            newTxt1Content += `${txt1Question.number}${txt1Question.separator}${txt1Question.question}\n`;
        }
    }

    writeTxtFile(txt1Path, newTxt1Content);
}

// 使用示例，替换为实际的 TXT 文件路径
const desktopPath = path.join(process.env.USERPROFILE, 'Desktop');
const txt1Path = path.join(desktopPath, '题目.txt');
const txt2Path = path.join(desktopPath, '儿科护理.txt');
compareAndWriteAnswers(txt1Path, txt2Path);