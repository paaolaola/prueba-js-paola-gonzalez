//CONVERSOR DE MONEDAS

// Elementos del conversor
let data = {};
const input = document.getElementById("amountClp");
const select = document.getElementById("select");
const btn = document.getElementById("btn");
const result = document.getElementById("resultConv");

// Función para obtener data
const getValues = async () => {
    try {
        const resUSD = await fetch("https://mindicador.cl/api/dolar");

        const resEUR = await fetch("https://mindicador.cl/api/euro");

        const valuesUSD = await resUSD.json();
        console.log(valuesUSD);
        const valuesEUR = await resEUR.json();
        console.log(valuesEUR);

        data.usd = valuesUSD.serie[0].valor;
        data.eur = valuesEUR.serie[0].valor;
    } catch (e) {
        console.error("Error al obtener los valores de conversión:", e);
        alert("Se ha producido un error al obtener los valores de conversión.");
    }
};

// Función de conversión
const convertCurrency = () => {
    const amountCLP = input.value;
    const selectedCurrency = select.value;

    if (selectedCurrency === "value1") {
        const amountUSD = amountCLP / data.usd;
        result.textContent = `$${amountUSD.toFixed(2)}`;
    } else if (selectedCurrency === "value2") {
        const amountEUR = amountCLP / data.eur;
        result.textContent = `€${amountEUR.toFixed(2)}`;
    }
};

// Evento del boton
btn.addEventListener("click", convertCurrency);

getValues();

//GRAFICO DE DOLAR Y EURO

//Ejecución metodo fetch con try y catch
const getGraphic = async () => {
    try {
        const responseDolar = await fetch("https://mindicador.cl/api/dolar");
        const responseEuro = await fetch("https://mindicador.cl/api/euro");

        const dataDolar = await responseDolar.json();
        const dataEuro = await responseEuro.json();

        const daysDolar = dataDolar.serie.slice(0, 10);
        const daysEuro = dataEuro.serie.slice(0, 10);

        //Valores y fechas de datos de la API
        const valuesDolar = daysDolar.map((item) => item.valor);
        const valuesEuro = daysEuro.map((item) => item.valor);
        const dates = daysDolar.map((item) => item.fecha);

        //Gráfico
        var options = {
            series: [
                {
                    name: "Dólar",
                    data: valuesDolar,
                },
                {
                    name: "Euro",
                    data: valuesEuro,
                },
            ],
            chart: {
                height: 350,
                type: "line",
                zoom: {
                    enabled: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                curve: "smooth",
            },
            title: {
                text: "Valor del Dólar y Euro en los últimos 10 días",
                align: "left",
            },
            grid: {
                row: {
                    colors: ["#f3f3f3", "transparent"],
                    opacity: 0.5,
                },
            },
            xaxis: {
                categories: dates,
            },
        };

        const chart = new ApexCharts(document.querySelector("#chart"), options);

        // Renderizar
        chart.render();
    } catch (error) {
        console.error("Error al obtener los valores:", error);
        alert("Se ha producido un error al obtener los valores.");
    }
};

getGraphic();
