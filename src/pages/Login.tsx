
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulação de login - em um app real faria uma requisição para https://objectminio.hostdime.com.br:9001
      // Nota: Esta é apenas uma simulação. Em produção, seria necessário implementar a
      // autenticação real com o MinIO Console
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Armazena algumas informações do usuário no localStorage para simulação
      localStorage.setItem("user", JSON.stringify({ username }));
      
      toast.success("Login realizado com sucesso!");
      navigate("/");
    } catch (error) {
      toast.error("Falha ao fazer login. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-gray-50">
      {/* Lado esquerdo - formulário */}
      <div className="flex items-center justify-center px-6 py-12 md:px-10 lg:px-20">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex justify-center">
              <svg 
                className="h-12 w-12" 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="50" cy="50" r="46" fill="#FF5800" />
                <path 
                  d="M34 66V34H50C56.6 34 62 39.4 62 46C62 52.6 56.6 58 50 58H42V66H34Z" 
                  fill="white" 
                />
                <path 
                  d="M58 66V54H66V66H58Z" 
                  fill="white" 
                />
              </svg>
            </div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Entre na sua conta
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Acesse seu painel de armazenamento MinIO
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="username">Nome de usuário</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="mt-1"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <a href="#" className="text-sm font-medium text-hostdime-orange hover:text-hostdime-orange/80">
                    Esqueceu a senha?
                  </a>
                </div>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-hostdime-orange hover:bg-hostdime-orange/90"
              disabled={isLoading}
            >
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>
            
            <p className="text-center text-sm text-gray-600">
              Não tem uma conta?{" "}
              <a href="https://core.hostdime.com.br" target="_blank" rel="noopener noreferrer" className="font-medium text-hostdime-orange hover:text-hostdime-orange/80">
                Contate o suporte
              </a>
            </p>
          </form>
        </div>
      </div>
      
      {/* Lado direito - imagem/branding */}
      <div className="hidden md:block bg-hostdime-orange relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-hostdime-orange to-hostdime-dark opacity-90"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-12">
          <h2 className="text-3xl font-bold mb-6">MinIO Object Storage</h2>
          <div className="max-w-md space-y-4 text-center">
            <p className="text-lg">
              Armazenamento de objetos seguro, escalável e confiável para todas as necessidades do seu negócio.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Escalável</h3>
                <p className="text-sm text-white/80">Armazene e recupere qualquer quantidade de dados, a qualquer momento.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Seguro</h3>
                <p className="text-sm text-white/80">Recursos de segurança avançados para proteger seus dados.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Confiável</h3>
                <p className="text-sm text-white/80">99,99% de tempo de atividade com armazenamento de dados redundante.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Acessível</h3>
                <p className="text-sm text-white/80">Pague apenas pelo que usar, sem taxas ocultas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
