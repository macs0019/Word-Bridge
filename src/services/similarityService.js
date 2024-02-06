import { Language } from "@mui/icons-material";
import axios from "axios";

export const similarity = async (word1, word2, language) => {
    try {
        if (language == 'cn') language = 'zh';
        if(language == 'us') language = 'en';

        console.log(`comparing ${word1} and ${word2}`)
        const response = await axios.get(`https://api.conceptnet.io/related/c/${language}/${word1}?filter=/c/${language}/${word2}/.&limit=1`);
        if (response?.data?.related[0]?.weight)
            return response.data.related[0].weight;
        else {
            return 0;
        }
    } catch (error) {
        console.error(error);
        throw error;
    }
};