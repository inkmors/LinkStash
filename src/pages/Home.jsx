/* eslint-disable no-unused-vars */
import { FiLink, FiArrowRight, FiCheck, FiMenu, FiX, FiExternalLink, FiChevronUp, FiChevronDown, FiSearch, FiGlobe, FiSave, FiFolder } from 'react-icons/fi'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { HeadProvider, Title, Meta, Link as HeadLink } from 'react-head'
import { motion, AnimatePresence } from 'framer-motion'

const SEO = () => (
  <>
    <Title>LinkStash | Organize e guarde seus itens favoritos</Title>
    <Meta name="description" content="O LinkStash é a melhor ferramenta para organizar seus bookmarks. Guarde, categorize e acesse seus links de qualquer dispositivo com sincronização em nuvem." />
    <Meta name="keywords" content="organizador de links, gerenciador de bookmarks, salvar links online, favoritos, compartilhar links, acessar links em qualquer dispositivo" />
    <Meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <Meta property="og:title" content="LinkStash | Sua biblioteca de itens organizada" />
    <Meta property="og:description" content="Organize todos seus itens importantes em um só lugar com acesso rápido de qualquer dispositivo." />
    <Meta property="og:type" content="website" />
    <Meta property="og:url" content="https://www.linkstash.com.br" />
    <Meta property="og:image" content="https://www.linkstash.com.br/images/social-preview.jpg" />
    
    <Meta name="twitter:card" content="summary_large_image" />
    <Meta name="twitter:title" content="LinkStash | Organize seus itens favoritos" />
    <Meta name="twitter:description" content="A solução perfeita para guardar e organizar todos os itens que você precisa." />
    <Meta name="twitter:image" content="https://www.linkstash.com.br/images/twitter-preview.jpg" />
    
    <HeadLink rel="icon" type="image/svg+xml" href="/src/assets/LinkStash-Favicon.png" />
    <HeadLink rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <HeadLink rel="manifest" href="/site.webmanifest" />
  </>
)

export default function LandingPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeFaq, setActiveFaq] = useState(0)

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2 
      } 
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 }
  }

  const features = [
    {
      title: "Organização Inteligente",
      description: "Categorize seus links, blocos de notas, listas de tarefas e imagens em pastas e com tags para um acesso rápido e eficiente.",
      icon: <FiFolder className="w-6 h-6 text-purple-500" />
    },
    {
      title: "Acesso em Qualquer Lugar",
      description: "Disponível em todos os seus dispositivos, a qualquer momento.",
      icon: <FiGlobe className="w-6 h-6 text-purple-500" />
    },
    {
      title: "Busca Rápida",
      description: "Encontre qualquer item em segundos com nossa busca poderosa.",
      icon: <FiSearch className="w-6 h-6 text-purple-500" />
    },
    {
      title: "Armazenamento Fácil",
      description: "Guarde coleções de itens com apenas um clique.",
      icon: <FiSave className="w-6 h-6 text-purple-500" />
    }
  ]

  const testimonials = [
    {
      quote: "Excelente! Ideal pra armazenar aqueles sites que sempre ficavam desorganizados. Facilita muito o meu dia a dia graças ao fácil acesso e a organização da plataforma. Recomendo muito!!",
      author: "Anna Gabriela Lima",
      role: "Estudante de História"
    },
    {
      quote: "Nunca pensei que seria tão simples manter tudo sincronizado entre meu celular e meu notebook.",
      author: "Felipe Andrade",
      role: "Analista de Sistemas"
    },
    {
      quote: "Finalmente uma solução que realmente entende como organizar links de forma útil. Recomendo!",
      author: "Bruno Silveira",
      role: "Gerente de Produto"
    },
    {
      quote: "Economizei muito tempo no meu dia a dia só por conseguir encontrar tudo em um só lugar.",
      author: "Tatiane Rocha",
      role: "Designer UI/UX"
    },
    {
      quote: "Ferramenta leve, intuitiva e extremamente funcional. Virou essencial no meu trabalho.",
      author: "Igor Almeida",
      role: "Desenvolvedor Full Stack"
    },
    {
      quote: "Me ajuda bastante na organização da minha rotina de trabalho/faculdade.",
      author: "Caiane Santos",
      role: "Professora de Artes Visuais e Estudante de Engenharia de Software"
    }
  ]

  const faqs = [
    {
      question: "O LinkStash é gratuito?",
      answer: "Sim, o LinkStash é totalmente gratuito e oferece todos os recursos principais sem custos adicionais."
    },
    {
      question: "Meus dados estarão seguros no LinkStash?",
      answer: "Sim, todos os dados são armazenados com criptografia e protegidos, garantindo a segurança das suas informações."
    },
    {
      question: "Posso acessar meus itens offline?",
      answer: "Atualmente o LinkStash requer conexão com a internet para sincronizar seus itens entre dispositivos."
    },
    {
      question: "LinkStash tem suporte para dispositivos móveis?",
      answer: "Sim, o LinkStash funciona perfeitamente em dispositivos móveis, permitindo que você acesse e edite seus dados em qualquer lugar."
    },
    {
      question: "O que posso armazenar no LinkStash?",
      answer: "Você pode armazenar links, blocos de notas, listas de tarefas e imagens. Tudo em um único lugar, com fácil acesso e organização."
    },
  ]

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index)
  }

  return (
    <HeadProvider>
      <div className="min-h-screen bg-gray-900">
        <SEO />

        <nav className="bg-gray-800 shadow-lg" aria-label="Navegação principal">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-20 items-center">
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
                className="flex items-center"
              >
                <div className="flex-shrink-0 flex items-center">
                  <FiLink className="h-8 w-8 text-purple-500 hover:text-purple-400 transition-colors duration-300 transform hover:rotate-12" />
                  <span className="ml-2 text-xl font-bold text-white hover:text-purple-300 transition-colors duration-300">
                    LinkStash
                  </span>
                </div>
              </motion.div>

              <div className="hidden md:flex md:items-center md:space-x-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 text-md font-medium text-purple-400 hover:text-white transition-all duration-300 flex items-center"
                    aria-label="Acessar conta existente"
                  >
                    Entrar
                  </Link>
                </motion.div>
                
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link 
                    to="/register" 
                    className="px-3 py-2 rounded-md text-sm font-medium text-white bg-purple-500 hover:bg-purple-600 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 flex justify-center"
                    aria-label="Criar nova conta"
                  >
                    Criar conta
                  </Link>
                </motion.div>
              </div>

              <motion.div 
                whileTap={{ scale: 0.9 }}
                className="md:hidden flex items-center"
              >
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none transition-all duration-300"
                  aria-expanded={isOpen}
                  aria-label="Menu mobile"
                >
                  {isOpen ? (
                    <FiX className="block h-6 w-6 transform rotate-180 transition-transform duration-300" />
                  ) : (
                    <FiMenu className="block h-6 w-6 transform hover:rotate-90 transition-transform duration-300" />
                  )}
                </button>
              </motion.div>
            </div>
          </div>

          <AnimatePresence>
            {isOpen && (
              <motion.div 
                initial={{ opacity: 0}}
                animate={{ opacity: 1}}
                exit={{ opacity: 0}}
                transition={{ duration: 0.3 }}
                className="md:hidden"
              >
                <motion.div 
                  variants={menuVariants}
                  initial="hidden"
                  animate="visible"
                  className="px-2 pt-2 pb-4 flex flex-col gap-3 sm:px-3 bg-gray-800 shadow-inner"
                >
                  <motion.div variants={itemVariants}>
                    <Link
                      to="/login"
                      className="px-3 py-3 rounded-md text-base font-medium text-purple-400 hover:text-white hover:bg-gray-700 transition-all duration-300 flex items-center justify-between"
                      onClick={() => setIsOpen(false)}
                      aria-label="Acessar conta pelo menu mobile"
                    >
                      Entrar
                      <FiArrowRight className="ml-2" />
                    </Link>
                  </motion.div>
                  
                  <motion.div variants={itemVariants}>
                    <Link
                      to="/register"
                      className="px-3 py-3 rounded-md text-base font-medium text-white bg-purple-500 hover:bg-purple-600 transition-all duration-300 flex items-center justify-between"
                      onClick={() => setIsOpen(false)}
                      aria-label="Criar conta pelo menu mobile"
                    >
                      Criar conta
                      <FiArrowRight className="ml-2" />
                    </Link>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
        
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              Organize e guarde seus <span className="text-purple-400">itens favoritos</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl sm:max-w-5xl mx-auto mb-8 sm:mb-10 px-4 sm:px-0">
              O LinkStash é a forma mais simples e rápida de armazenar links, listas de tarefas, blocos de notas e imagens, tudo em um só lugar. Acesse de qualquer dispositivo, organize com tags e pastas, e compartilhe facilmente o que mais importa para você.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Link 
                to="/register" 
                className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold text-white bg-purple-500 hover:bg-purple-600 transition-colors flex items-center justify-center"
                aria-label="Começar a usar o LinkStash"
              >
                Comece agora <FiArrowRight className="ml-2" />
              </Link>
              <a 
                href="#demo" 
                className="px-4 sm:px-6 md:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold text-purple-400 border border-purple-400 hover:bg-gray-700 transition-colors flex items-center justify-center"
                aria-label="Ver demonstração do LinkStash"
              >
                Ver demonstração
              </a>
            </div>
          </div>
        </section>

      
        <section id="features" className="w-full overflow-x-hidden py-16 md:py-20 bg-gray-900">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                Por que escolher o LinkStash?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto">
                Tudo que você precisa para organizar seus itens de forma eficiente
              </p>
            </header>
      
            <div className="flex flex-wrap justify-center gap-6 md:gap-8">
              {features.map((feature, index) => (
                <motion.article
                  key={index}
                  whileHover={{ y: -5 }}
                  className="w-full sm:w-[calc(25%-24px)] min-w-[250px] max-w-[90%] bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300"
                  itemScope
                  itemProp="featureList"
                  itemType="https://schema.org/Feature"
                >
                  <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2" itemProp="name">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400" itemProp="description">
                    {feature.description}
                  </p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="bg-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
              <div className="mb-12 lg:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Veja a LinkStash em ação
                </h2>
                <p className="text-xl text-gray-400 mb-8">
                  Nossa plataforma intuitiva torna a organização de links, blocos de notas, listas de tarefas e imagens de forma simples e eficiente. <br /><br />Assista à demonstração para descobrir como tudo funciona na prática.
                </p>
                <ul className="space-y-4">
                  {[
                    "Interface limpa e fácil de usar",
                    "Sincronização instantânea entre dispositivos",
                    "Busca poderosa por tags e conteúdo",
                    "Compartilhamento fácil e rápido com um clique"
                  ].map((item, index) => (
                    <li key={index} className="flex items-start">
                      <FiCheck className="text-green-500 mt-1 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-700 rounded-xl overflow-hidden shadow-xl">
                <div className="aspect-w-16 aspect-h-9">
                  <div className="w-full h-80 bg-gradient-to-r from-purple-400 to-indigo-500 flex items-center justify-center" aria-label="Demonstração da interface do LinkStash">
                    <FiExternalLink className="w-20 h-20 text-white opacity-70" />
                  </div>
                </div>
                <div className="p-4 bg-gray-800">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-white">Demonstração do LinkStash</h4>
                      <p className="text-sm text-gray-400">Veja como funciona na prática</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="bg-gradient-to-br from-gray-700 to-gray-800 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Veja o que nossos usuários estão dizendo
              </h2>
              <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                Junte-se a diversos profissionais que já transformaram a forma como guardam seus itens.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <blockquote key={index} className="bg-gray-800 rounded-xl p-6 shadow-md flex flex-col justify-between" itemScope itemProp="review" itemType="https://schema.org/Review">
                  <div>
                    <div className="mb-4" itemProp="reviewRating" itemScope itemType="https://schema.org/Rating">
                      <meta itemProp="ratingValue" content="5" />
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-2xl">★</span> 
                      ))}
                    </div>
                    <p className="text-gray-300 mb-6 italic" itemProp="reviewBody">
                      "{testimonial.quote}"
                    </p>
                  </div>
                  <div className="flex items-center" itemProp="author" itemScope itemType="https://schema.org/Person">
                    <div>
                      <p className="font-medium text-white" itemProp="name">{testimonial.author}</p>
                      <p className="text-sm text-gray-400" itemProp="jobTitle">{testimonial.role}</p>
                    </div>
                  </div>
                  <div itemProp="itemReviewed" itemScope itemType="https://schema.org/Organization">
                    <meta itemProp="name" content="LinkStash" />
                  </div>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16 bg-gradient-to-br from-gray-700 to-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8 text-center">Perguntas Frequentes</h2>
            
            <div itemScope itemType="https://schema.org/FAQPage" className="space-y-4">
              {faqs.map((faq, index) => (
                <div 
                  key={index} 
                  itemScope 
                  itemProp="mainEntity" 
                  itemType="https://schema.org/Question" 
                  className="bg-gray-800 rounded-lg overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex justify-between items-center p-4 md:p-6 focus:outline-none"
                    aria-expanded={activeFaq === index}
                    aria-controls={`faq-${index}`}
                  >
                    <h3 itemProp="name" className="text-left text-lg md:text-xl font-semibold text-white">
                      {faq.question}
                    </h3>
                    {activeFaq === index ? (
                      <FiChevronUp className="text-purple-400 w-5 h-5 ml-4" />
                    ) : (
                      <FiChevronDown className="text-purple-400 w-5 h-5 ml-4" />
                    )}
                  </button>
                  
                  <div
                    id={`faq-${index}`}
                    className={`transition-all duration-300 overflow-hidden ${activeFaq === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <div 
                      itemScope 
                      itemProp="acceptedAnswer" 
                      itemType="https://schema.org/Answer"
                      className="px-4 md:px-6 pb-4 md:pb-6 pt-0 text-gray-400"
                    >
                      <p itemProp="text">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20" style={{
          background: "linear-gradient(to right, #8b5cf6, #4f46e5)"
        }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Pronto para organizar seus itens de vez?
              </h2>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto mb-10">
                Comece hoje mesmo e tenha todos seus itens importantes a um clique de distância.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link 
                  to="/register" 
                  className="px-8 py-4 rounded-lg text-lg font-semibold text-purple-600 bg-white hover:bg-purple-50 transition-colors flex items-center justify-center"
                  aria-label="Criar conta gratuita no LinkStash"
                >
                  Criar conta gratuita <FiArrowRight className="ml-2" />
                </Link>
              </div>
              <p className="mt-6 text-purple-200 text-sm">
                <FiCheck className="inline mr-2" />
                Não requer cartão de crédito • Experimente gratuitamente
              </p>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </HeadProvider>
  )
}