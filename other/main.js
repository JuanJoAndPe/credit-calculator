document.getElementById('calcularBtn').addEventListener('click', function () {
  // Obtener los valores de los campos
  const tipoProducto = document.getElementById('tipo_producto').value;
  const monto = document.getElementById('monto').value;
  const ingresoDeudor = document.getElementById('ingresoDeudor').value;
  const plazo = document.getElementById('plazo').value;
  const ingresoConyuge = document.getElementById('ingresoConyuge').value || 0;
  const cedulaDeudor = document.getElementById('cedulaDeudor').value;
  const otrosIngresos = document.getElementById('otrosIngresos').value || 0;
  const estadocivil = document.getElementById('estado_civil').value;
  const cedulaConyuge = document.getElementById('cedulaConyuge').value;
  const hijos = document.getElementById('numerohijos').value || 0;
  const activos = document.getElementById('Activos').value || 0;
  const separacionBienes = document.querySelector(
    'input[name="separacion"]:checked',
  )?.value;
  const terminosAceptados = document.getElementById('terminos').checked;

  // Validar que todos los campos estÃ©n llenos
  if (!tipoProducto) {
    window.alert("El campo 'Tipo de Producto' es obligatorio.");
    return;
  }
  if (!monto) {
    window.alert("El campo 'Monto' es obligatorio.");
    return;
  }
  if (!plazo) {
    window.alert("El campo 'Plazo' es obligatorio.");
    return;
  }
  if (!cedulaDeudor) {
    window.alert("El campo 'CÃ©dula del Deudor' es obligatorio.");
    return;
  }
  if (!estadocivil) {
    window.alert("El campo 'Estado Civil' es obligatorio.");
    return;
  }
  if (
    (estadocivil === 'Casada/o' || estadocivil === 'UniÃ³n Libre') &&
    !separacionBienes
  ) {
    window.alert("El campo 'SeparaciÃ³n de Bienes' es obligatorio.");
    return;
  }
  if (
    (estadocivil === 'Casada/o' || estadocivil === 'UniÃ³n Libre') &&
    !cedulaConyuge
  ) {
    window.alert(
      "El campo 'CÃ©dula del CÃ³nyuge' es obligatorio para el estado civil seleccionado.",
    );
    return;
  }
  if (!ingresoDeudor) {
    window.alert("El campo 'Ingreso del Deudor' es obligatorio.");
    return;
  }
  if (!terminosAceptados) {
    window.alert('Debe aceptar los tÃ©rminos y condiciones para continuar.');
    return;
  }

  // Convertir los valores a nÃºmeros
  const montoNum = parseFloat(monto);
  const ingresoDeudorNum = parseFloat(ingresoDeudor);
  const plazoNum = parseInt(plazo);
  const ingresoConyugeNum = parseFloat(ingresoConyuge) || 0;
  const otrosIngresosNum = parseFloat(otrosIngresos) || 0;
  const numeroHijos = Math.trunc(parseFloat(hijos)) || 0;
  const activosNum = parseFloat(activos) || 0;

  const regexCedula = /^\d{10}$/;

  // Validar que el monto no estÃ© vacÃ­o y sea mayor que 0
  if (isNaN(montoNum) || montoNum <= 0) {
    window.alert(
      "El campo 'Monto' no puede estar vacÃ­o y debe ser mayor que 0.",
    );
    return;
  }

  // Validar que el plazo no estÃ© vacÃ­o y sea mayor que 0
  if (isNaN(plazoNum) || plazoNum <= 0) {
    window.alert(
      "El campo 'Plazo' no puede estar vacÃ­o y debe ser mayor que 0.",
    );
    return;
  }

  // Validar que la cÃ©dula del deudor tenga 10 dÃ­gitos
  if (!regexCedula.test(cedulaDeudor)) {
    window.alert('La cÃ©dula del deudor debe tener exactamente 10 dÃ­gitos.');
    return;
  }

  // Validar que la cÃ©dula del cÃ³nyuge tenga 10 dÃ­gitos si es requerida
  if (
    (estadocivil === 'Casada/o' || estadocivil === 'UniÃ³n Libre') &&
    !regexCedula.test(cedulaConyuge)
  ) {
    window.alert(
      'La cÃ©dula del cÃ³nyuge debe tener exactamente 10 dÃ­gitos.',
    );
    return;
  }

  // Validar que el ingreso del deudor no sea negativo
  if (ingresoDeudorNum <= 0) {
    window.alert(
      'El ingreso del deudor no puede ser negativo y debe ser mayor que 0.',
    );
    return;
  }

  // Validar que el ingreso del cÃ³nyuge no sea negativo
  if (ingresoConyugeNum < 0) {
    window.alert('El ingreso del cÃ³nyuge no puede ser negativo.');
    return;
  }

  // Validar que otros ingresos no sean negativos
  if (otrosIngresosNum < 0) {
    window.alert('Los otros ingresos no pueden ser negativos.');
    return;
  }

  // Validar que hijos no sean negativos
  if (numeroHijos < 0) {
    window.alert('Los hijos no pueden ser negativos.');
    return;
  }

  //Variables usadas en API y posterior
  let identificacionSujeto;
  let nombreRazonSocial;
  let identificacionConyuge;
  let nombresConyuge;
  let score;
  let scoreConyuge;
  let evaluacionIntegral;
  let validarIngresos;
  let ctaCorrientes;
  let deudaVigenteTotal;
  let cuotaTotal;
  let valorDemandaJudicial;
  let valorCarteraCastigada;
  let deudaVigenteConyuge = 0;
  let cuotaTotalConyuge = 0;

  // Crear un array de promesas para las solicitudes fetch
  const fetchPromises = [];

  //FunciÃ³n para llamar API
  fetchPromises.push(
    fetch('https://juanjoandpe.github.io/pre/proxy.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + localStorage.getItem('token'),
      },
      body: JSON.stringify({
        origin: 'webservice',
        request: {
          codigoProducto: 'D1047',
          datosEntrada: [
            {
              clave: 'tipoIdentificacionSujeto',
              valor: 'C',
            },
            {
              clave: 'identificacionSujeto',
              valor: cedulaDeudor.toString(),
            },
            {
              clave: 'tipoIdentificacionConyuge',
              valor: 'C',
            },
            {
              clave: 'identificacionConyuge',
              valor: cedulaConyuge.toString() || '',
            },
            {
              clave: 'tipoPrestamo',
              valor: 'consumo',
            },
            {
              clave: 'montoSolicitado',
              valor: montoNum,
            },
            {
              clave: 'plazo',
              valor: plazoNum,
            },
            {
              clave: 'ingresos',
              valor: ingresoDeudorNum || '',
            },
            {
              clave: 'gastosPersonales',
              valor: '',
            },
          ],
        },
      }),
    }),
  );

  // Si existe cÃ©dula del cÃ³nyuge, agregamos otra solicitud fetch para el cÃ³nyuge
  if (cedulaConyuge) {
    fetchPromises.push(
      fetch('https://juanjoandpe.github.io/pre/proxy.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + localStorage.getItem('token'),
        },
        body: JSON.stringify({
          origin: 'webservice',
          request: {
            codigoProducto: 'D1047',
            datosEntrada: [
              {
                clave: 'tipoIdentificacionSujeto',
                valor: 'C',
              },
              {
                clave: 'identificacionSujeto',
                valor: cedulaConyuge.toString(),
              },
              {
                clave: 'tipoIdentificacionConyuge',
                valor: '',
              },
              {
                clave: 'identificacionConyuge',
                valor: '',
              },
              {
                clave: 'tipoPrestamo',
                valor: 'consumo',
              },
              {
                clave: 'montoSolicitado',
                valor: montoNum,
              },
              {
                clave: 'plazo',
                valor: plazoNum,
              },
              {
                clave: 'ingresos',
                valor: ingresoConyugeNum || '',
              },
              {
                clave: 'gastosPersonales',
                valor: '',
              },
            ],
          },
        }),
      }),
    );
  }

  // Ejecutar todas las solicitudes en paralelo
  Promise.all(fetchPromises)
    .then((responses) => Promise.all(responses.map((res) => res.json())))
    .then((jsons) => {
      const [deudorData, conyugeData] = jsons;

      console.log(deudorData);
      console.log(conyugeData);

      // Procesar datos del deudor principal
      if (
        deudorData.result &&
        deudorData.result.identificacionTitular &&
        deudorData.result.identificacionTitular.length > 0
      ) {
        identificacionSujeto =
          deudorData.result.identificacionTitular[0].identificacionSujeto;
        nombreRazonSocial =
          deudorData.result.identificacionTitular[0].nombreRazonSocial;
        console.log('CÃ©dula deudor:', identificacionSujeto);
        console.log('Nombres deudor:', nombreRazonSocial);
      }
      if (
        deudorData.result &&
        deudorData.result.datosConyuge &&
        deudorData.result.datosConyuge.length > 0
      ) {
        identificacionConyuge =
          deudorData.result.datosConyuge[0].identificacionConyuge;
        nombresConyuge = deudorData.result.datosConyuge[0].nombresConyuge;
        console.log('CÃ©dula cÃ³nyuge:', identificacionConyuge);
        console.log('Nombres cÃ³nyuge:', nombresConyuge);
      }
      if (
        deudorData.result &&
        deudorData.result.modeloMaxcredit &&
        deudorData.result.modeloMaxcredit.length > 0
      ) {
        score = parseInt(
          deudorData.result.modeloMaxcredit[0].detalle[0].valorObtenido,
        );
        valorDemandaJudicial = parseFloat(
          deudorData.result.modeloMaxcredit[0].detalle[2].valorObtenido,
        );
        valorCarteraCastigada = parseFloat(
          deudorData.result.modeloMaxcredit[0].detalle[3].valorObtenido,
        );
        console.log('Score Deudor', score);
        console.log('Demanda Judicial Deudor:', valorDemandaJudicial);
        console.log('Cartera Castigada Deudor:', valorCarteraCastigada);
      }
      if (
        deudorData.result &&
        deudorData.result.modeloMaxcreditConyuge &&
        deudorData.result.modeloMaxcreditConyuge.length > 0
      ) {
        scoreConyuge = parseInt(
          deudorData.result.modeloMaxcreditConyuge[0].detalle[0].valorObtenido,
        );
        demandaJudicialConyuge = parseFloat(
          deudorData.result.modeloMaxcreditConyuge[0].detalle[2].valorObtenido,
        );
        carteraCastigadaConyuge = parseFloat(
          deudorData.result.modeloMaxcreditConyuge[0].detalle[3].valorObtenido,
        );
        console.log('Score Codeudor', scoreConyuge);
        console.log('Demanda Judicial Codeudor:', demandaJudicialConyuge);
        console.log('Cartera Castigada Codeudor:', carteraCastigadaConyuge);
      }
      if (
        deudorData.result &&
        deudorData.result.evaluacionIntegral &&
        deudorData.result.evaluacionIntegral.length > 0
      ) {
        evaluacionIntegral =
          deudorData.result.evaluacionIntegral[0].evaluacionIntegral;
      }
      if (
        deudorData.result &&
        deudorData.result.parametrosEntrada &&
        deudorData.result.parametrosEntrada.length > 0
      ) {
        validarIngresos =
          deudorData.result.parametrosEntrada[0].validadorIngresos;
        console.log('Ingreso digitado:', ingresoDeudorNum, validarIngresos);
      }
      if (
        deudorData.result &&
        deudorData.result.manejoCuentasCorrientes &&
        deudorData.result.manejoCuentasCorrientes.length > 0
      ) {
        ctaCorrientes =
          deudorData.result.manejoCuentasCorrientes[0].accionDescripcion;
        console.log('Manejo Ctas Corrientes', ctaCorrientes);
      }
      if (
        deudorData.result &&
        deudorData.result.deudaVigenteTotal &&
        deudorData.result.deudaVigenteTotal.length > 0
      ) {
        deudaVigenteTotal = parseFloat(
          deudorData.result.deudaVigenteTotal[0].totalDeuda,
        );
        console.log('Pasivos', deudaVigenteTotal);
      } else {
        deudaVigenteTotal = 0;
        console.log('Pasivos Deudor', deudaVigenteTotal);
      }
      if (deudaVigenteTotal === 0) {
        cuotaTotal = 0;
        console.log('Cuota Deudor', cuotaTotal);
      } else if (
        deudorData.result &&
        deudorData.result.gastoFinanciero &&
        deudorData.result.gastoFinanciero.length > 0
      ) {
        cuotaTotal =
          parseFloat(
            deudorData.result.gastoFinanciero[0].cuotaEstimadaTitular,
          ) || 0;
        console.log('Cuota Deudor', cuotaTotal);
      }

      // Procesar datos del cÃ³nyuge si existen
      if (conyugeData) {
        if (
          conyugeData.result &&
          conyugeData.result.deudaVigenteTotal &&
          conyugeData.result.deudaVigenteTotal.length > 0
        ) {
          deudaVigenteConyuge = parseFloat(
            conyugeData.result.deudaVigenteTotal[0].totalDeuda,
          );
          console.log('Pasivo Conyuge', deudaVigenteConyuge);
        }

        if (
          conyugeData.result &&
          conyugeData.result.gastoFinanciero &&
          conyugeData.result.gastoFinanciero.length > 0
        ) {
          cuotaTotalConyuge =
            parseFloat(
              conyugeData.result.gastoFinanciero[0].cuotaEstimadaTitular,
            ) || 0;
          console.log('Cuota Conyuge', cuotaTotalConyuge);
        }
        if (
          conyugeData.result &&
          conyugeData.result.evaluacionIntegral &&
          conyugeData.result.evaluacionIntegral.length > 0
        ) {
          evaIntegralConyuge =
            conyugeData.result.evaluacionIntegral[0].evaluacionIntegral;
          console.log('EvaluaciÃ³n Integral', evaIntegralConyuge);
        }
        if (
          conyugeData.result &&
          conyugeData.result.parametrosEntrada &&
          conyugeData.result.parametrosEntrada.length > 0
        ) {
          validarIngresos =
            conyugeData.result.parametrosEntrada[0].validadorIngresos;
          console.log(
            'Ingreso digitado Conyuge:',
            ingresoConyugeNum,
            validarIngresos,
          );
        }
      }

      //
      //Validaciones con datos de API
      //

      //ValidaciÃ³n SCORE
      let decisionScore;
      if (
        evaluacionIntegral == 'AAA' ||
        evaluacionIntegral == 'AA' ||
        evaluacionIntegral == 'A'
      ) {
        if (
          !conyugeData ||
          evaIntegralConyuge == 'AAA' ||
          evaIntegralConyuge == 'AA' ||
          evaIntegralConyuge == 'A'
        ) {
          decisionScore = 'APROBADO';
        } else if (
          evaIntegralConyuge == 'Analista' ||
          evaIntegralConyuge == 'Sin InformaciÃ³n'
        ) {
          decisionScore = 'ANALISTA';
        } else if (evaIntegralConyuge == 'Rechazar') {
          decisionScore = 'RECHAZAR';
        }
      } else if (evaluacionIntegral == 'Analista') {
        if (!conyugeData) {
          decisionScore = 'ANALISTA';
        } else if (
          evaIntegralConyuge == 'AAA' ||
          evaIntegralConyuge == 'AA' ||
          evaIntegralConyuge == 'A'
        ) {
          decisionScore = 'ANALISTA';
        } else if (
          evaIntegralConyuge == 'Analista' ||
          evaIntegralConyuge == 'Sin InformaciÃ³n'
        ) {
          decisionScore = 'ANALISTA';
        } else if (evaIntegralConyuge == 'Rechazar') {
          decisionScore = 'RECHAZAR';
        }
      } else if (evaluacionIntegral == 'Rechazar') {
        decisionScore = 'RECHAZAR';
      } else if (evaluacionIntegral == 'Sin InformaciÃ³n') {
        if (!conyugeData) {
          decisionScore = 'ANALISTA';
        } else if (
          evaIntegralConyuge == 'AAA' ||
          evaIntegralConyuge == 'AA' ||
          evaIntegralConyuge == 'A'
        ) {
          decisionScore = 'ANALISTA';
        } else if (
          evaIntegralConyuge == 'Analista' ||
          evaIntegralConyuge == 'Sin InformaciÃ³n'
        ) {
          decisionScore = 'ANALISTA';
        } else if (evaIntegralConyuge == 'Rechazar') {
          decisionScore = 'RECHAZAR';
        }
      }
      console.log('Decision SCORE', decisionScore);

      //ValidaciÃ³n Cartera Castigada
      let decisionCarteraCastigada;
      if (valorCarteraCastigada > 0) {
        decisionCarteraCastigada = 'RECHAZADO';
      } else if (conyugeData && carteraCastigadaConyuge > 0) {
        decisionCarteraCastigada = 'RECHAZADO';
      } else {
        decisionCarteraCastigada = 'OK';
      }
      console.log('Decision Cartera Castigada', decisionCarteraCastigada);

      //ValidaciÃ³n Demanda Judicial
      let decisionDemandaJudicial;
      if (valorDemandaJudicial > 0) {
        decisionDemandaJudicial = 'RECHAZADO';
      } else if (conyugeData && demandaJudicialConyuge > 0) {
        decisionDemandaJudicial = 'RECHAZADO';
      } else {
        decisionDemandaJudicial = 'OK';
      }
      console.log('Decision Cartera Castigada', decisionDemandaJudicial);

      // ValidaciÃ³n y cÃ¡lculo de patrimonio
      const MyE = 3500;
      let totalPasivos = deudaVigenteTotal + deudaVigenteConyuge;
      let patrimonio = (activosNum + MyE - totalPasivos).toFixed(2);
      console.log('Patrimonio', patrimonio);
      console.log('Pasivos Totales', totalPasivos.toFixed(2));

      //Cuota financiera deudor
      document.getElementById('gastosFinancierosDeudor').value =
        cuotaTotal.toFixed(2);

      //Cuota financiera deudor
      if (conyugeData) {
        document.getElementById('gastosFinancierosConyuge').value =
          cuotaTotalConyuge.toFixed(2);
      }

      // LÃ³gica para calcular la tasa segÃºn el tipo de producto
      let tasa;
      if (tipoProducto == 'Vehicular') {
        tasa = 0.156; // 15.60%
      } else if (tipoProducto == 'Consumo') {
        tasa = 0.156; // 15.60%
      } else if (tipoProducto == 'MicrocrÃ©dito') {
        tasa = 0.2209; // 22.09%
      } else if (tipoProducto == 'Inmobiliario') {
        tasa = 0.11; // 11%
      } else {
        window.alert('Ingrese Tipo de CrÃ©dito');
        return;
      }

      // CÃ¡lculo de la cuota mensual
      const interesMensual = tasa / 12;
      const cuotaMensual =
        (montoNum * interesMensual) /
        (1 - Math.pow(1 + interesMensual, -plazoNum));

      // CÃ¡lculo de gastos familiares
      let gastosFamiliares;
      if (!cedulaConyuge) {
        gastosFamiliares = 150;
      } else {
        gastosFamiliares = 240;
      }

      // CÃ¡lculo del costo adicional por hijos
      let numHijos = 0;
      for (let i = 1; i <= numeroHijos; i++) {
        numHijos += 90;
      }

      // CÃ¡lculo de ingresos y gastos totales
      const ingresoBruto =
        ingresoDeudorNum + ingresoConyugeNum + otrosIngresosNum;
      const gastosFamiliaresTotales = gastosFamiliares + numHijos;
      document.getElementById('gastosFamiliaresTotales').value =
        gastosFamiliaresTotales.toFixed(2);
      const gastosTotales =
        cuotaTotal + cuotaTotalConyuge + gastosFamiliaresTotales;
      const ingresoNeto = ingresoBruto - gastosTotales;
      const ingresoDisponible = ingresoNeto * 0.5;
      const indicadorEndeudamiento = ingresoDisponible / cuotaMensual;

      //Ãrbol de decisiÃ³n
      let decisionFinal;
      if (
        decisionScore == 'RECHAZAR' &&
        decisionCarteraCastigada == 'OK' &&
        decisionDemandaJudicial == 'OK'
      ) {
        decisionFinal = 'RECHAZADO';
      } else if (
        (decisionScore == 'ANALISTA' || decisionScore == 'APROBADO') &&
        decisionCarteraCastigada == 'RECHAZADO'
      ) {
        decisionFinal = 'RECHAZADO';
      } else if (
        (decisionScore == 'ANALISTA' || decisionScore == 'APROBADO') &&
        decisionCarteraCastigada == 'OK' &&
        decisionDemandaJudicial == 'RECHAZADO'
      ) {
        decisionFinal = 'RECHAZADO';
      } else if (
        decisionScore == 'ANALISTA' &&
        decisionCarteraCastigada == 'OK' &&
        decisionDemandaJudicial == 'OK' &&
        patrimonio > 0 &&
        indicadorEndeudamiento < 1
      ) {
        decisionFinal = 'ANALISTA CONDICIONADO // JUSTIFICAR INGRESOS';
      } else if (
        decisionScore == 'ANALISTA' &&
        decisionCarteraCastigada == 'OK' &&
        decisionDemandaJudicial == 'OK' &&
        patrimonio < 0 &&
        indicadorEndeudamiento < 1
      ) {
        decisionFinal =
          'ANALISTA CONDICIONADO // JUSTIFICAR INGRESOS  // JUSTIFICAR PATRIMONIO';
      } else if (
        decisionScore == 'ANALISTA' &&
        decisionCarteraCastigada == 'OK' &&
        decisionDemandaJudicial == 'OK' &&
        patrimonio > 0 &&
        indicadorEndeudamiento < 1
      ) {
        decisionFinal = 'ANALISTA CONDICIONADO // JUSTIFICAR INGRESOS';
      } else if (
        decisionScore == 'ANALISTA' &&
        decisionCarteraCastigada == 'OK' &&
        decisionDemandaJudicial == 'OK' &&
        patrimonio > 0 &&
        indicadorEndeudamiento > 1
      ) {
        decisionFinal = 'PRE - APROBADO ANALISTA';
      } else if (
        decisionScore == 'APROBADO' &&
        decisionCarteraCastigada == 'OK' &&
        decisionDemandaJudicial == 'OK' &&
        patrimonio < 0 &&
        indicadorEndeudamiento < 1
      ) {
        decisionFinal =
          'PRE - APROBADO // JUSTIFICAR INGRESOS  // JUSTIFICAR PATRIMONIO';
      } else if (
        decisionScore == 'APROBADO' &&
        decisionCarteraCastigada == 'OK' &&
        decisionDemandaJudicial == 'OK' &&
        patrimonio < 0 &&
        indicadorEndeudamiento > 1
      ) {
        decisionFinal = 'PRE - APROBADO CONDICIONADO // JUSTIFICAR PATRIMONIO';
      } else if (
        decisionScore == 'APROBADO' &&
        decisionCarteraCastigada == 'OK' &&
        decisionDemandaJudicial == 'OK' &&
        patrimonio > 0 &&
        indicadorEndeudamiento < 1
      ) {
        decisionFinal = 'PRE - APROBADO CONDICIONADO // JUSTIFICAR INGRESOS';
      } else if (
        decisionScore == 'APROBADO' &&
        decisionCarteraCastigada == 'OK' &&
        decisionDemandaJudicial == 'OK' &&
        patrimonio > 0 &&
        indicadorEndeudamiento > 1
      ) {
        decisionFinal = 'PRE - APROBADO';
      } else {
        decisionFinal = 'RECHAZADO';
      }
      console.log(decisionFinal);

      // Crear el contenido HTML para mostrar los resultados
      const resultadosHTML = `
            <p><strong>Monto a Financiar:</strong> $${montoNum.toFixed(2)}</p>
            <p><strong>Plazo:</strong> ${plazoNum} meses</p>
            <p><strong>Tasa:</strong> ${(tasa * 100).toFixed(2)}%</p>
            <p><strong>Cuota Mensual:</strong> $${cuotaMensual.toFixed(2)}</p>`;

      // Crear el contenido HTML para mostrar los resultados
      const FinalDecision = `
            <h3><strong>${decisionFinal}</strong>`;

      // Mostrar los resultados en el contenedor
      document.getElementById('resultados').innerHTML = resultadosHTML;
      document.getElementById('decision').innerHTML = FinalDecision;

      // Generar el PDF
      const doc = new jsPDF();

      // ConfiguraciÃ³n inicial
      doc.setFont('helvetica');
      doc.setFontSize(12);

      // Logo o encabezado (opcional)
      // doc.addImage(logoData, 'JPEG', 10, 10, 50, 15);

      // TÃ­tulo
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 128); // Color azul oscuro
      doc.text('RESUMEN DE ANÃLISIS CREDITICIO', 105, 20, null, null, 'center');

      // InformaciÃ³n del cliente
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0); // Color negro
      doc.text(`Cliente: ${nombreRazonSocial}`, 14, 30);
      doc.text(`CÃ©dula: ${identificacionSujeto}`, 110, 30);
      doc.text(`Score: ${score}`, 14, 36);
      doc.text(`DecisiÃ³n: ${evaluacionIntegral}`, 14, 42);
      if (identificacionConyuge) {
        doc.text(`CÃ³nyuge: ${nombresConyuge}`, 14, 42);
        doc.text(`CÃ©dula cÃ³nyuge: ${identificacionConyuge}`, 14, 48);
      }

      // Datos del crÃ©dito
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 128);
      doc.text('DETALLES DEL CRÃ‰DITO SOLICITADO', 14, 60);
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);
      doc.text(`â€¢ Monto solicitado: $${montoNum.toFixed(2)}`, 20, 66);
      doc.text(`â€¢ Plazo: ${plazoNum} meses`, 20, 74);
      doc.text(
        `â€¢ Tasa de interÃ©s: ${(tasa * 100).toFixed(2)}% anual`,
        20,
        82,
      );
      doc.text(
        `â€¢ Cuota mensual estimada: $${cuotaMensual.toFixed(2)}`,
        20,
        90,
      );

      // SituaciÃ³n financiera en cuadro resumen
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 128);
      doc.text('SITUACIÃ“N FINANCIERA', 14, 114);

      // Dibujar cuadro principal
      doc.setDrawColor(0, 0, 128); // Color azul para el borde
      doc.setLineWidth(0.5);
      doc.rect(14, 120, 180, 65); // Cuadro principal

      // LÃ­neas horizontales divisorias
      doc.line(14, 130, 194, 130);
      doc.line(14, 140, 194, 140);
      doc.line(14, 150, 194, 150);
      doc.line(14, 160, 194, 160);
      doc.line(14, 170, 194, 170);

      // LÃ­nea vertical divisoria
      doc.line(100, 120, 100, 185);

      // TÃ­tulo primera columna (Capacidad de Pago)
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 128);
      doc.text('CAPACIDAD DE PAGO', 20, 127);

      // Contenido del cuadro (primera columna)
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text('Ingresos totales:', 20, 137);
      doc.text('Gastos familiares:', 20, 147);
      doc.text('Obligaciones financieras:', 20, 157);
      doc.text('Ingreso disponible:', 20, 167);
      doc.text('Capacidad de pago:', 20, 177);

      // Valores (primera columna)
      doc.setFont('helvetica', 'bold');
      doc.text(`$${ingresoBruto.toFixed(2)}`, 70, 137);
      doc.text(`$${gastosFamiliaresTotales.toFixed(2)}`, 70, 147);
      doc.text(`$${(cuotaTotal + cuotaTotalConyuge).toFixed(2)}`, 70, 157);
      doc.text(`$${ingresoDisponible.toFixed(2)}`, 70, 167);
      doc.text(`${indicadorEndeudamiento.toFixed(2)}`, 70, 177);

      // TÃ­tulo segunda columna (Patrimonio)
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 128);
      doc.text('PATRIMONIO', 120, 127);

      // Contenido del cuadro (segunda columna)
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      doc.text('Activos declarados:', 110, 137);
      doc.text('Pasivos totales:', 110, 147);
      doc.text('Patrimonio neto:', 110, 157);

      // Valores (segunda columna)
      doc.setFont('helvetica', 'bold');
      doc.text(`$${activosNum.toFixed(2)}`, 160, 137);
      doc.text(`$${totalPasivos.toFixed(2)}`, 160, 147);

      // Color del patrimonio segÃºn sea positivo o negativo
      if (parseFloat(patrimonio) >= 0) {
        doc.setTextColor(0, 128, 0);
      } else {
        doc.setTextColor(255, 0, 0);
      }
      doc.text(`$${patrimonio}`, 160, 157);

      // Resultado del anÃ¡lisis
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 128);
      doc.text('RESULTADO DEL ANÃLISIS', 14, 192);

      doc.setFontSize(14);

      // Color segÃºn la decisiÃ³n
      if (decisionFinal.includes('APROBADO')) {
        doc.setTextColor(0, 128, 0);
      } else if (decisionFinal.includes('ANALISTA')) {
        doc.setTextColor(255, 165, 0);
      } else {
        doc.setTextColor(255, 0, 0);
      }

      doc.text(`${decisionFinal}`, 20, 200);

      // Observaciones
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        'Observaciones: Este documento es un resumen informativo. La aprobaciÃ³n final estÃ¡ sujeta a verificaciÃ³n',
        14,
        280,
      );
      doc.text(
        'documental y cumplimiento de polÃ­ticas crediticias de la instituciÃ³n.',
        14,
        284,
      );

      // Pie de pÃ¡gina
      doc.setFontSize(8);
      doc.setTextColor(150, 150, 150);
      doc.text(
        `Generado el ${new Date().toLocaleDateString()} a las ${new Date().toLocaleTimeString()}`,
        105,
        290,
        null,
        null,
        'center',
      );

      // Guardar el PDF
      doc.save(`Resumen_Credito_${identificacionSujeto}.pdf`);
    })
    .catch((error) => console.error('Error en la consulta:', error));
});
