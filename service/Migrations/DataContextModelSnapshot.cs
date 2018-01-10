﻿// <auto-generated />
using EngineSimulator.Services.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.EntityFrameworkCore.Storage.Internal;
using System;

namespace EngineSimulatorService.Migrations
{
    [DbContext(typeof(DataContext))]
    partial class DataContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn)
                .HasAnnotation("ProductVersion", "2.0.0-rtm-26452");

            modelBuilder.Entity("EngineSimulator.Services.Models.Engine", b =>
                {
                    b.Property<long>("id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("sensors")
                        .IsRequired();

                    b.Property<string>("vin")
                        .IsRequired();

                    b.HasKey("id");

                    b.ToTable("Engine");
                });

            modelBuilder.Entity("EngineSimulator.Services.Models.SensorData", b =>
                {
                    b.Property<long>("id")
                        .ValueGeneratedOnAdd()
                        .HasAnnotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn);

                    b.Property<string>("datavalue")
                        .IsRequired();

                    b.Property<string>("sensorname")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<long>("timestamp");

                    b.Property<string>("vin")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.HasKey("id");

                    b.ToTable("SensorData");
                });
#pragma warning restore 612, 618
        }
    }
}