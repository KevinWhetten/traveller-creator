﻿using System.Linq;
using Moq;
using NUnit.Framework;
using SectorCreator.Global;
using SectorCreator.Global.Enums;
using SectorCreator.Models.Basic;
using SectorCreator.Models.Basic.Factories;
using SectorCreator.Models.Factories.T5;
using SectorCreator.Models.RTTWorldgen;
using SectorCreator.Models.RTTWorldgen.Factories;

namespace SectorCreator.Models.Tests.Factories.Basic;

[TestFixture]
public class HexFactoryTests
{
    private HexFactory _classUnderTest;
    private readonly Mock<IRollingService> _rollingServiceMock = new();
    private readonly Mock<IStarSystemFactory> _starSystemFactoryMock = new();
    private readonly Mock<IT5StarSystemFactory> _t5StarSystemFactoryMock = new();
    private readonly Mock<IRttWorldgenStarSystemFactory> _rttWorldgenStarSystemFactoryMock = new();

    [SetUp]
    public void SetUp()
    {
        _starSystemFactoryMock.Setup(x => x.GenerateMongooseStarSystem(It.IsAny<SectorType>(), It.IsAny<Coordinates>()))
            .Returns(new StarSystem());
        _t5StarSystemFactoryMock.Setup(x => x.Generate()).Returns(new StarSystem());

        _classUnderTest = new HexFactory(_rollingServiceMock.Object, _starSystemFactoryMock.Object, _t5StarSystemFactoryMock.Object, _rttWorldgenStarSystemFactoryMock.Object);
    }

    [TestCase(false)]
    [TestCase(true)]
    public void WhenGeneratingMongooseHex(bool starSystem)
    {
        _rollingServiceMock.Setup(x => x.D6(1)).Returns(starSystem ? 6 : 0);

        var hex = _classUnderTest.GenerateMongooseHex(new Coordinates(1, 1),
            new Coordinates(1, 1), SectorType.Basic);

        Assert.That(hex.StarSystems.Count, Is.EqualTo(starSystem ? 1 : 0));
    }

    [Test]
    public void WhenGeneratingT5Hex()
    {
        throw new InconclusiveException("Not Implemented");
    }

    [TestCase(false, false, CompanionOrbit.Close, 0)]
    [TestCase(true, false, CompanionOrbit.Close, 1)]
    [TestCase(false, true, CompanionOrbit.Close, 1)]
    [TestCase(true, true, CompanionOrbit.Close, 2)]
    [TestCase(false, true, CompanionOrbit.Distant, 2)]
    [TestCase(true, true, CompanionOrbit.Distant, 3)]
    public void WhenGeneratingRttWorldgenHex(bool brownDwarfStarSystem, bool starSystem, CompanionOrbit companionOrbit,
        int expectedStarSystems)
    {
        var returnedStarSystem = new RttWorldgenStarSystem() {CompanionStars = {new RttWorldgenStar {CompanionOrbit = companionOrbit}}};
        _rttWorldgenStarSystemFactoryMock.Setup(x => x.Generate(It.IsAny<StarSystemType>(), It.IsAny<Coordinates>()))
            .Returns(returnedStarSystem);
        _rttWorldgenStarSystemFactoryMock.Setup(x => x.Generate(It.IsAny<RttWorldgenStar>(), It.IsAny<Coordinates>()))
            .Returns(new RttWorldgenStarSystem());

        _rollingServiceMock.SetupSequence(x => x.D6(1))
            .Returns(brownDwarfStarSystem ? 6 : 0)
            .Returns(starSystem ? 6 : 0);

        var hex = _classUnderTest.GenerateRttWorldgenHex(new Coordinates(1, 1),
            new Coordinates(1, 1));

        Assert.That(hex.StarSystems.Count, Is.EqualTo(expectedStarSystems));
        if (expectedStarSystems > 0) {
            Assert.That(hex.StarSystems.First().CompanionStars.Count <= 3);
            Assert.That(hex.StarSystems.First().Planets.Count <= 13);
        }
    }

    [TestCase(false)]
    [TestCase(true)]
    public void WhenGeneratingStarFrontiersHex(bool starSystem)
    {
        _rollingServiceMock.Setup(x => x.D10(1)).Returns(starSystem ? 10 : 0);

        var hex = _classUnderTest.GenerateStarFrontiersHex(new Coordinates(1, 1), new Coordinates(1, 1));

        Assert.That(hex.StarSystems.Count, Is.EqualTo(starSystem ? 1 : 0));
    }

    [TestCase(1, 1, 1, 1, 1, 1)]
    [TestCase(1, 1, 5, 6, 5, 6)]
    [TestCase(2, 3, 1, 1, 9, 21)]
    [TestCase(2, 3, 5, 6, 13, 26)]
    public void WhenSettingCoordinates(int subsectorCoordinateX, int subsectorCoordinateY, int hexCoordinateX,
        int hexCoordinateY, int expectedCoordinateX, int expectedCoordinateY)
    {
        var hex = _classUnderTest.GenerateMongooseHex(new Coordinates(subsectorCoordinateX, subsectorCoordinateY),
            new Coordinates(hexCoordinateX, hexCoordinateY), SectorType.Basic);

        Assert.That(hex.Coordinates.X, Is.EqualTo(expectedCoordinateX));
        Assert.That(hex.Coordinates.Y, Is.EqualTo(expectedCoordinateY));
    }
}