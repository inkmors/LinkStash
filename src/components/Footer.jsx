import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa'
import { FiMail, FiLink } from 'react-icons/fi'
import { useState } from 'react'

export default function Footer() {
  const [openModal, setOpenModal] = useState(null)

  const handleOpenModal = (type) => {
    setOpenModal(type)
  }

  return (
    <footer className="bg-gray-900 border-t border-gray-800 w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-5 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start gap-10 md:gap-16 lg:gap-24">
          
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-4">
              <FiLink className="h-5 w-5 text-purple-400 hover:text-purple-300 transition-colors duration-300 transform hover:rotate-12" />
              <h3 className="text-lg font-semibold text-white">LinkStash</h3>
            </div>
            <p className="text-gray-400 mb-4 md:text-left max-w-xs">
              Organize e guarde seus itens favoritos de qualquer lugar.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <FaGithub />, url: "https://github.com/inkmors/Link-Stash" },
                { icon: <FaInstagram />, url: "https://www.instagram.com/morusu.ink/" },
                { icon: <FaLinkedin />, url: "https://www.linkedin.com/in/vin%C3%ADcius-lima-738603284/" }
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-purple-400 transition-colors text-lg"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className=" flex flex-col gap-3 text-left">
              <li>
                <button 
                  onClick={() => handleOpenModal('Termos de Serviço')}
                  className="cursor-pointer text-gray-500 hover:text-white transition-colors"
                >
                  Termos de Serviço
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleOpenModal('Política de Privacidade')}
                  className="cursor-pointer text-gray-500 hover:text-white transition-colors"
                >
                  Política de Privacidade
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleOpenModal('Cookies')}
                  className="cursor-pointer text-gray-500 hover:text-white transition-colors"
                >
                  Cookies
                </button>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-start">
            <h3 className="text-lg font-semibold text-white mb-4">Contato</h3>
            <div className="flex flex-col gap-3 text-center md:text-left">
              <div className="flex flex-row items-center gap-3 text-gray-400">
                <div className="flex justify-center md:justify-start">
                  <FiMail className="flex-shrink-0" />
                </div>
                <span className="text-sm break-all">gvlima.contato@gmail.com</span>
              </div>
              <div className="flex flex-row items-center gap-3 text-gray-400">
                <div className="flex justify-center md:justify-start">
                  <FaGithub className="flex-shrink-0" />
                </div>
                <span className="text-sm">github.com/inkmors</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm text-center">
            © {new Date().getFullYear()} LinkStash. Todos os direitos reservados.
          </p>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-white">{openModal}</h2>
                <button
                  onClick={() => setOpenModal(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="text-gray-300">
                {openModal === 'Termos de Serviço' && <TermsContent />}
                {openModal === 'Política de Privacidade' && <PrivacyContent />}
                {openModal === 'Cookies' && <CookiesContent />}
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setOpenModal(null)}
                  className="cursor-pointer px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </footer>
  )
}

const TermsContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">1. Aceitação dos Termos</h3>
    <p>
      Ao utilizar o LinkStash, você concorda com estes Termos de Serviço e com nossa Política de Privacidade.
      Se você não concordar com algum termo, por favor, não utilize nossos serviços.
    </p>
    
    <h3 className="text-lg font-semibold">2. Uso do Serviço</h3>
    <p>
      Você concorda em usar o serviço apenas para fins legais e de acordo com estas condições.
      É proibido usar nossos serviços para:
    </p>
    <ul className="list-disc pl-5 space-y-1">
      <li>Qualquer atividade ilegal</li>
      <li>Violar direitos de propriedade intelectual</li>
      <li>Enviar conteúdo malicioso ou spam</li>
    </ul>
    
    <h3 className="text-lg font-semibold">3. Conta do Usuário</h3>
    <p>
      Você é responsável por manter a confidencialidade de sua conta e senha.
      Todas as atividades realizadas com sua conta são de sua responsabilidade.
    </p>
  </div>
)

const PrivacyContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">1. Informações Coletadas</h3>
    <p>
      Coletamos informações que você nos fornece diretamente ao criar uma conta,
      como nome, e-mail e dados de uso do serviço.
    </p>
    
    <h3 className="text-lg font-semibold">2. Uso das Informações</h3>
    <p>
      Utilizamos suas informações para:
    </p>
    <ul className="list-disc pl-5 space-y-1">
      <li>Fornecer e manter nossos serviços</li>
      <li>Melhorar a experiência do usuário</li>
      <li>Comunicar-se com você sobre atualizações</li>
    </ul>
    
    <h3 className="text-lg font-semibold">3. Compartilhamento de Dados</h3>
    <p>
      Não vendemos ou compartilhamos seus dados pessoais com terceiros,
      exceto quando necessário para fornecer o serviço ou por exigência legal.
    </p>
  </div>
)

const CookiesContent = () => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">O que são Cookies?</h3>
    <p>
      Cookies são pequenos arquivos de texto armazenados no seu dispositivo
      quando você acessa nosso site. Eles nos ajudam a lembrar suas preferências
      e melhorar sua experiência.
    </p>
    
    <h3 className="text-lg font-semibold">Como usamos Cookies</h3>
    <p>
      Utilizamos cookies para:
    </p>
    <ul className="list-disc pl-5 space-y-1">
      <li>Autenticação e segurança</li>
      <li>Lembrar preferências</li>
      <li>Análise de uso do serviço</li>
    </ul>
    
    <h3 className="text-lg font-semibold">Controle de Cookies</h3>
    <p>
      Você pode controlar ou deletar cookies através das configurações do seu navegador.
      No entanto, isso pode afetar o funcionamento de alguns recursos do site.
    </p>
  </div>
)