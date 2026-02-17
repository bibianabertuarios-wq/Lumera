// 🐍✨ DASHBOARD PREMIUM - RENACIMIENTO
// Archivo: premium/premium-dashboard.js

// Esta función se agregará automáticamente al contexto global
window.renderPremiumDashboard = function() {
  const [editableFields, setEditableFields] = React.useState({
    age: currentUser?.age || 45,
    weight: currentUser?.weight || 65,
    height: currentUser?.height || 165,
    goal: currentUser?.wellness_goal || (language === 'es' ? 'Renacer cada día' : 'Reborn every day')
  });

  const [todaySymptoms, setTodaySymptoms] = React.useState({});

  // Síntomas con simbolismo de renacimiento
  const symptoms = [
    { id: 'sleep', label: language === 'es' ? '😴 Descanso' : '😴 Rest', emoji: '😴' },
    { id: 'anxiety', label: language === 'es' ? '🕊️ Calma' : '🕊️ Peace', emoji: '🕊️' },
    { id: 'energy', label: language === 'es' ? '🔥 Energía' : '🔥 Energy', emoji: '🔥' },
    { id: 'mood', label: language === 'es' ? '✨ Ánimo' : '✨ Mood', emoji: '✨' },
    { id: 'hotflashes', label: language === 'es' ? '🌺 Sofocos' : '🌺 Hot flashes', emoji: '🌺' },
    { id: 'bloating', label: language === 'es' ? '🦋 Ligera' : '🦋 Light', emoji: '🦋' }
  ];

  // Mensajes de renacimiento
  const renewalMessages = [
    language === 'es' ? 'Como la serpiente, dejas atrás lo que ya no te sirve' : 'Like the snake, you leave behind what no longer serves you',
    language === 'es' ? 'Cada día es una nueva piel, más sabia y fuerte' : 'Each day is a new skin, wiser and stronger',
    language === 'es' ? 'Tu transformación es natural, hermosa y poderosa' : 'Your transformation is natural, beautiful and powerful'
  ];

  // Calcular IMC
  const calculateBMI = () => {
    const heightM = editableFields.height / 100;
    const bmi = editableFields.weight / (heightM * heightM);
    return bmi.toFixed(1);
  };

  // Manejar click en síntoma
  const handleSymptomClick = (symptomId) => {
    const currentLevel = todaySymptoms[symptomId] || 0;
    const newLevel = currentLevel >= 5 ? 0 : currentLevel + 1;
    setTodaySymptoms(prev => ({
      ...prev,
      [symptomId]: newLevel
    }));
  };

  // Editar campo
  const editField = async (field, value) => {
    const fieldNames = {
      age: language === 'es' ? 'edad' : 'age',
      weight: language === 'es' ? 'peso' : 'weight', 
      height: language === 'es' ? 'altura' : 'height',
      goal: language === 'es' ? 'objetivo' : 'goal'
    };
    
    const newValue = prompt(
      `${language === 'es' ? 'Nuevo' : 'New'} ${fieldNames[field]}:`, 
      value
    );
    
    if (newValue && newValue !== value) {
      setEditableFields(prev => ({ ...prev, [field]: newValue }));
      
      // Guardar en Supabase
      try {
        const updateData = {};
        if (field === 'age') updateData.age = parseInt(newValue);
        if (field === 'weight') updateData.weight = parseFloat(newValue);
        if (field === 'height') updateData.height = parseFloat(newValue);
        if (field === 'goal') updateData.wellness_goal = newValue;
        
        await supabase
          .from('users')
          .update(updateData)
          .eq('id', currentUser.id);
      } catch (error) {
        console.error('Error updating field:', error);
      }
    }
  };

  return React.createElement('div', { className: 'pb-32 space-y-8' },
    React.createElement('div', { className: 'premium-dashboard' },
      
      // 🐍✨ BIENVENIDA DEL RENACIMIENTO
      React.createElement('div', { className: 'premium-card' },
        React.createElement('h1', { 
          className: 'text-3xl font-light mb-2 premium-title' 
        }, language === 'es' ? `✨ Bienvenida a tu renacimiento, ${userName}` : `✨ Welcome to your rebirth, ${userName}`),
        
        React.createElement('p', { 
          className: 'text-lg premium-subtitle mb-4' 
        }, renewalMessages[Math.floor(Math.random() * renewalMessages.length)]),
        
        React.createElement('p', { 
          className: 'text-sm text-gray-600' 
        }, language === 'es' 
          ? '🐍 Año de la Serpiente - Tiempo de transformación' 
          : '🐍 Year of the Snake - Time for transformation')
      ),

      // 📊 TU ESENCIA (DATOS EDITABLES)
      React.createElement('div', { className: 'premium-card' },
        React.createElement('h3', { 
          className: 'text-xl font-medium mb-4 premium-title' 
        }, language === 'es' ? '🌸 Tu esencia' : '🌸 Your essence'),
        
        React.createElement('div', { className: 'grid grid-cols-2 md:grid-cols-4 gap-4 text-center' },
          // Edad
          React.createElement('div', {},
            React.createElement('p', { 
              className: 'text-sm text-gray-600 mb-2' 
            }, language === 'es' ? '🌱 Años de sabiduría' : '🌱 Years of wisdom'),
            React.createElement('span', {
              className: 'premium-editable text-lg font-medium',
              onClick: () => editField('age', editableFields.age)
            }, editableFields.age)
          ),
          
          // Peso
          React.createElement('div', {},
            React.createElement('p', { 
              className: 'text-sm text-gray-600 mb-2' 
            }, language === 'es' ? '⚖️ Peso actual' : '⚖️ Current weight'),
            React.createElement('span', {
              className: 'premium-editable text-lg font-medium',
              onClick: () => editField('weight', editableFields.weight)
            }, `${editableFields.weight} kg`)
          ),
          
          // IMC
          React.createElement('div', {},
            React.createElement('p', { 
              className: 'text-sm text-gray-600 mb-2' 
            }, '💫 IMC'),
            React.createElement('span', {
              className: 'premium-editable text-lg font-medium'
            }, calculateBMI())
          ),
          
          // Objetivo
          React.createElement('div', { className: 'md:col-span-1 col-span-2' },
            React.createElement('p', { 
              className: 'text-sm text-gray-600 mb-2' 
            }, language === 'es' ? '🎯 Mi intención' : '🎯 My intention'),
            React.createElement('span', {
              className: 'premium-editable text-sm font-medium',
              onClick: () => editField('goal', editableFields.goal),
              style: { minWidth: '120px' }
            }, editableFields.goal)
          )
        )
      ),

      // 🎯 CÓMO TE SIENTES HOY
      React.createElement('div', { className: 'premium-card' },
        React.createElement('h3', { 
          className: 'text-xl font-medium mb-4 premium-title' 
        }, language === 'es' ? '🎯 ¿Cómo te sientes hoy?' : '🎯 How do you feel today?'),
        
        React.createElement('div', { className: 'premium-symptom-grid' },
          ...symptoms.map(symptom =>
            React.createElement('div', {
              key: symptom.id,
              className: `premium-symptom-item ${todaySymptoms[symptom.id] > 0 ? 'selected' : ''}`,
              onClick: () => handleSymptomClick(symptom.id)
            },
              React.createElement('div', { 
                className: 'text-2xl mb-2' 
              }, symptom.emoji),
              
              React.createElement('div', { 
                className: 'text-xs font-medium text-gray-700' 
              }, symptom.label.replace(/^.{2}\s/, '')),
              
              todaySymptoms[symptom.id] > 0 && React.createElement('div', {
                className: 'text-xs mt-2 font-bold',
                style: { color: '#d4af37' }
              }, `${todaySymptoms[symptom.id]}/5`)
            )
          )
        ),
        
        React.createElement('p', { 
          className: 'text-xs text-gray-600 mt-4 text-center' 
        }, language === 'es' 
          ? '✨ Toca cada aspecto para honrar cómo te sientes (1-5)' 
          : '✨ Tap each aspect to honor how you feel (1-5)')
      ),

      // 📈 TU EVOLUCIÓN
      React.createElement('div', { className: 'premium-card' },
        React.createElement('h3', { 
          className: 'text-xl font-medium mb-4 premium-title' 
        }, language === 'es' ? '📈 Tu transformación (últimos 7 días)' : '📈 Your transformation (last 7 days)'),
        
        React.createElement('div', { 
          className: 'h-40 bg-gradient-to-r from-amber-50 to-rose-50 rounded-xl flex items-center justify-center' 
        },
          React.createElement('div', { className: 'text-center' },
            React.createElement('div', { className: 'text-4xl mb-2' }, '🐍✨'),
            React.createElement('p', { 
              className: 'text-gray-600 font-medium' 
            }, language === 'es' 
              ? 'Gráfico de tu renacimiento (próximamente)' 
              : 'Your rebirth chart (coming soon)')
          )
        )
      )
    )
  );
};
