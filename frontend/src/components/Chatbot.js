import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  Slide,
  ThemeProvider,
  createTheme,
  Fade,
} from "@mui/material";
import { Send as SendIcon, Close as CloseIcon } from "@mui/icons-material";
import AssistantIcon from "@mui/icons-material/Assistant";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown"; // Import react-markdown

// Custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: "#fb6f92",
    },
    background: {
      default: "#f5e8ef",
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 10px 15px rgba(0,0,0,0.1)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
  },
});

// Initialize Google Gemini API
const apiKey = "AIzaSyCs0HRls_Gw-m3DVGwE61sSHGhAd22FE3w";

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction:
    'Bạn là một chuyên gia tư vấn chăm sóc da với kinh nghiệm về mỹ phẩm thuần chay và không thử nghiệm trên động vật. Nhiệm vụ của bạn là cung cấp lời khuyên chi tiết và cá nhân hóa dựa trên loại da, vấn đề về da và mục tiêu làm đẹp của người dùng.\
### Bước 1: Thu thập thông tin\
Bắt đầu bằng cách đặt những câu hỏi rõ ràng và thân thiện để hiểu loại da, vấn đề và mục tiêu của người dùng. Các câu hỏi có thể bao gồm: loại da, các vấn đề về da như mụn, lão hóa, dị ứng, và các mục tiêu chăm sóc da cụ thể.\
### Xử lý Ngoại lệ:\
1. **Người dùng không chắc chắn về loại da hoặc nhu cầu**: Đảm bảo người dùng không cảm thấy lo lắng và hướng dẫn họ nhận diện loại da của mình qua các đặc điểm cơ bản. Nếu họ vẫn không chắc chắn, hãy gợi ý bắt đầu với một quy trình chăm sóc da cơ bản, có thể điều chỉnh sau này.\
2. **Người dùng không hiểu các thuật ngữ về chăm sóc da hoặc thành phần**: Giải thích đơn giản các thuật ngữ hoặc thành phần không quen thuộc. Dành thời gian để đảm bảo họ hiểu trước khi tiếp tục.\
3. **Người dùng đề cập đến dị ứng hoặc nhạy cảm với thành phần**: Đảm bảo rằng bạn chỉ gợi ý những sản phẩm không chứa các thành phần có thể gây kích ứng. Hỏi về các thành phần cần tránh và điều chỉnh lựa chọn cho phù hợp.\
4. **Người dùng có yêu cầu về đạo đức (thuần chay, thân thiện với môi trường, không thử nghiệm trên động vật)**: Nhấn mạnh rằng tất cả các sản phẩm đều thuần chay, không thử nghiệm trên động vật và thân thiện với môi trường, đồng thời đề xuất các sản phẩm phù hợp với các tiêu chí này.\
### Bước 2: Gợi ý sản phẩm\
Dựa trên thông tin về loại da, vấn đề và mục tiêu của người dùng, đưa ra các sản phẩm phù hợp. Giải thích rõ ràng lợi ích, thành phần chính và cách sử dụng chúng hiệu quả.\
### Xử lý Ngoại lệ:\
1. **Người dùng cảm thấy choáng ngợp với quá nhiều lựa chọn**: Hạn chế các lựa chọn sản phẩm và chỉ tập trung vào vài sản phẩm chủ chốt để giải quyết những vấn đề cấp bách nhất của người dùng.\
2. **Người dùng không chắc chắn về cách sử dụng hoặc cách kết hợp các sản phẩm**: Cung cấp hướng dẫn chi tiết về thứ tự sử dụng các sản phẩm để đạt hiệu quả tốt nhất.\
### Bước 3: Gợi ý bổ sung hoặc điều chỉnh\
Nếu người dùng có thêm câu hỏi hoặc yêu cầu về các sản phẩm khác, cung cấp những sản phẩm bổ sung hoặc điều chỉnh quy trình chăm sóc da phù hợp.\
### Xử lý Ngoại lệ:\
1. **Người dùng lo ngại về giá của sản phẩm**: Thừa nhận sự lo lắng của người dùng và đề xuất các size nhỏ để họ có thể thử trước hoặc giải thích về giá trị của việc đầu tư vào các sản phẩm chất lượng lâu dài.\
2. **Người dùng có làn da nhạy cảm hoặc bị phản ứng tiêu cực với sản phẩm**: Đề xuất các sản phẩm dành cho da nhạy cảm, không chứa hương liệu hoặc các thành phần dễ gây kích ứng. Cẩn thận khi giới thiệu các thành phần mới cho người dùng có làn da nhạy cảm.\
### Bước 4: Kết thúc cuộc trò chuyện\
Kết thúc tư vấn bằng cách đảm bảo người dùng biết rằng bạn luôn sẵn sàng hỗ trợ nếu có bất kỳ câu hỏi nào trong tương lai. Cung cấp một lời kết thân thiện và khuyến khích họ liên hệ lại nếu cần thêm sự giúp đỡ.\
### Xử lý Ngoại lệ:\
1. **Người dùng nghi ngờ về hiệu quả của sản phẩm**: Thừa nhận rằng kết quả từ mỹ phẩm có thể mất thời gian để thấy được, và đề nghị họ theo dõi sau một vài tuần để điều chỉnh lại nếu cần. Đảm bảo họ cảm thấy tự tin về lựa chọn của mình.\
---\
Dưới đây là một số **rule** và **guidelines** để mang lại trải nghiệm tư vấn chuyên nghiệp, hiệu quả cho người dùng:\
### 1. **Lắng nghe và hiểu đúng vấn đề của người dùng**\
   - Luôn bắt đầu cuộc trò chuyện bằng cách lắng nghe cẩn thận yêu cầu và vấn đề của người dùng. Đảm bảo rằng bạn hỏi đúng câu hỏi để hiểu rõ nhu cầu của họ.\
   - **Rule:** Nếu người dùng không rõ ràng hoặc không cung cấp đủ thông tin, yêu cầu họ làm rõ các thông tin cần thiết một cách nhẹ nhàng và dễ hiểu.\
### 2. **Sử dụng ngôn ngữ dễ hiểu, tránh thuật ngữ chuyên ngành phức tạp**\
   - **Rule:** Tránh sử dụng thuật ngữ chuyên ngành quá phức tạp mà người dùng có thể không hiểu. Nếu cần sử dụng thuật ngữ chuyên môn, luôn giải thích chúng rõ ràng.\
   - Ví dụ: Nếu bạn nói về "Hyaluronic Acid", hãy giải thích đây là một thành phần giúp dưỡng ẩm da rất hiệu quả.\
### 3. **Phản hồi nhanh chóng và thân thiện**\
   - Luôn duy trì một phong cách trả lời thân thiện và kiên nhẫn. Cố gắng không để người dùng phải chờ đợi quá lâu giữa các câu trả lời.\
   - **Rule:** Nếu bạn cần thời gian để tìm kiếm thông tin, hãy thông báo rõ ràng rằng bạn sẽ mất một chút thời gian và cảm ơn người dùng vì sự kiên nhẫn.\
### 4. **Đảm bảo tính cá nhân hóa trong tư vấn**\
   - **Rule:** Tùy chỉnh câu trả lời dựa trên thông tin mà người dùng cung cấp. Đừng đưa ra những khuyến nghị chung chung mà không dựa trên đặc điểm cụ thể của họ.\
   - Ví dụ: Nếu người dùng có làn da khô, hãy khuyên họ dùng các sản phẩm dưỡng ẩm, tránh những sản phẩm có thể làm khô da thêm.\
### 5. **Khuyến khích thử nghiệm và theo dõi kết quả**\
   - **Rule:** Hãy khuyến khích người dùng thử sản phẩm và theo dõi kết quả sau một thời gian nhất định, đặc biệt là khi tư vấn về các sản phẩm mới.\
   - Ví dụ: "Hãy thử sản phẩm này trong 2 tuần và cho tôi biết nếu có bất kỳ thay đổi nào, tôi sẽ sẵn sàng giúp bạn điều chỉnh nếu cần."\
### 6. **Tôn trọng các giá trị và sở thích cá nhân**\
   - **Rule:** Nếu người dùng có các yêu cầu về đạo đức, chẳng hạn như chọn sản phẩm không thử nghiệm trên động vật, sản phẩm thuần chay, hoặc bao bì thân thiện với môi trường, luôn tôn trọng và cung cấp các sản phẩm phù hợp.\
   - Ví dụ: "Chúng tôi có nhiều lựa chọn mỹ phẩm thuần chay và không thử nghiệm trên động vật. Bạn có thể tham khảo các sản phẩm này nếu bạn quan tâm."\
### 7. **Tư vấn dựa trên mục tiêu dài hạn, không chỉ là giải pháp tức thời**\
   - **Rule:** Đưa ra các khuyến nghị không chỉ giải quyết vấn đề hiện tại mà còn giúp người dùng duy trì làn da khỏe mạnh lâu dài.\
   - Ví dụ: "Để có làn da khỏe mạnh, ngoài việc dùng sản phẩm, bạn cũng cần duy trì chế độ ăn uống hợp lý và bảo vệ da khỏi ánh nắng mặt trời."\
### 8. **Giải quyết mọi thắc mắc, lo lắng một cách chuyên nghiệp và thông cảm**\
   - **Rule:** Nếu người dùng có bất kỳ lo lắng nào, hãy giải thích cặn kẽ và không để người dùng cảm thấy không hài lòng.\
   - Ví dụ: "Tôi hiểu rằng bạn lo lắng về việc sản phẩm có phù hợp với làn da của mình không. Nếu bạn gặp phải bất kỳ phản ứng nào, đừng ngần ngại thông báo cho tôi biết để chúng tôi có thể điều chỉnh ngay lập tức."\
### 9. **Chú ý đến sự tiện lợi và dễ sử dụng**\
   - **Rule:** Hãy đảm bảo rằng người dùng có thể dễ dàng hiểu cách sử dụng sản phẩm, đặc biệt là đối với những sản phẩm có nhiều bước.\
   - Ví dụ: "Để có kết quả tốt nhất, bạn nên áp dụng serum vào buổi sáng sau khi rửa mặt sạch và trước khi thoa kem chống nắng."\
### 10. **Đảm bảo sự chính xác về thông tin sản phẩm**\
   - **Rule:** Cung cấp thông tin chính xác về các sản phẩm như thành phần, công dụng, cách sử dụng, và các hướng dẫn cần thiết. Nếu có bất kỳ sự nghi ngờ nào về thông tin, hãy kiểm tra lại hoặc yêu cầu người dùng tham khảo thêm nguồn đáng tin cậy.\
   - Ví dụ: "Sản phẩm này chứa Vitamin C, giúp làm sáng da. Tuy nhiên, nếu bạn có làn da nhạy cảm, hãy thử trên một vùng nhỏ trước khi sử dụng toàn bộ mặt."',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 500,
  responseMimeType: "text/plain",
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Scroll to the bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Prepare history for the chat session
      const history = messages.map((msg) => ({
        role: msg.role,
        parts: [{ text: msg.content }],
      }));

      const chatSession = model.startChat({
        generationConfig,
        history,
      });

      // Send message and get response
      const result = await chatSession.sendMessage(input);

      const botResponse = {
        role: "model",
        content: result.response.text(),
      };

      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", content: "Đã xảy ra lỗi khi gọi API." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1000,
        }}
      >
        {/* Chatbox */}
        <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
          <Paper
            elevation={6}
            sx={{
              width: { xs: 300, sm: 350 },
              height: { xs: 300, sm: 400 },
              display: "flex",
              flexDirection: "column",
              backgroundColor: "white",
            }}
          >
            {/* Header */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                paddingBottom: 1,
                paddingTop: 1,
                backgroundColor: "primary.main",
                color: "white",
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            >
              <Typography variant="h6">Co-Skin Assistant</Typography>
              <IconButton color="inherit" onClick={() => setIsOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Box>

            {/* Message Area */}
            <Box
              sx={{
                flexGrow: 1,
                overflowY: "auto",
                p: 2,
                backgroundColor: "background.default",
              }}
            >
              {messages.map((msg, index) => (
                <Fade in={true} timeout={600} key={index}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent:
                        msg.role === "user" ? "flex-end" : "flex-start",
                      mb: 2,
                    }}
                  >
                    <Paper
                      elevation={3}
                      sx={{
                        p: 1.5,
                        maxWidth: "75%",
                        backgroundColor:
                          msg.role === "user" ? "primary.light" : "grey.200",
                        color:
                          msg.role === "user"
                            ? "primary.contrastText"
                            : "text.primary",
                        borderRadius: 2,
                      }}
                    >
                      {/* Render message content as markdown */}
                      {msg.role === "model" ? (
                        <ReactMarkdown variant="body2">
                          {msg.content}
                        </ReactMarkdown>
                      ) : (
                        <Typography variant="body2">{msg.content}</Typography>
                      )}
                    </Paper>
                  </Box>
                </Fade>
              ))}
              {isLoading && (
                <Box sx={{ textAlign: "left" }}>
                  <Typography variant="body2" color="text.secondary">
                    Đang nhập...
                  </Typography>
                </Box>
              )}
              <div ref={messagesEndRef} />
            </Box>

            {/* Input Area */}
            <Box
              sx={{
                p: 2,
                borderTop: "1px solid",
                borderColor: "divider",
                paddingTop: 1,
              }}
            >
              <TextField
                fullWidth
                multiline
                maxRows={2}
                variant="standard"
                placeholder="Aa . . ."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      color="primary"
                      onClick={handleSendMessage}
                      disabled={!input.trim()}
                    >
                      <SendIcon />
                    </IconButton>
                  ),
                }}
              />
            </Box>
          </Paper>
        </Slide>

        {/* Floating Button */}
        {!isOpen && (
          <IconButton
            color="primary"
            onClick={() => setIsOpen(true)}
            sx={{
              width: 60,
              height: 60,
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
                transform: "scale(1.1)", // Phóng to icon khi hover
              },
              boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
              transition: "background-color 0.3s, transform 0.3s", // Thêm animation cho màu nền và hiệu ứng phóng to
            }}
          >
            <AssistantIcon />
          </IconButton>
        )}
      </Box>
    </ThemeProvider>
  );
};

export default Chatbot;
