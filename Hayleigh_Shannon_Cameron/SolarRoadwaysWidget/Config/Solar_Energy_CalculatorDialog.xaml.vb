Imports System
Imports System.Collections.Generic
Imports System.Collections.ObjectModel
Imports System.Linq
Imports System.Text
Imports System.Windows
Imports System.Windows.Controls
Imports ESRI.ArcGIS.OperationsDashboard
Imports client = ESRI.ArcGIS.Client

Namespace Config

Public Class Solar_Energy_CalculatorDialog
  Inherits Window

  Private _dataSource As ESRI.ArcGIS.OperationsDashboard.DataSource

  Property DataSource As ESRI.ArcGIS.OperationsDashboard.DataSource

    Get
      Return _dataSource
    End Get

    Private Set(value As ESRI.ArcGIS.OperationsDashboard.DataSource)
      _dataSource = value
    End Set

  End Property

  Private _field As ESRI.ArcGIS.Client.Field

  Property Field As ESRI.ArcGIS.Client.Field

    Get
      Return _field
    End Get

    Private Set(value As ESRI.ArcGIS.Client.Field)
      _field = value
    End Set

  End Property

  Private _caption As String

  Property Caption As String

    Get
      Return _caption
    End Get

    Private Set(value As String)
      _caption = value
    End Set

  End Property

  Public Sub New(dataSources As IList(Of ESRI.ArcGIS.OperationsDashboard.DataSource), initialCaption As String, initialDataSourceId As String, initialField As String)
    InitializeComponent()

    ' When re-configuring, initialize the widget config dialog from the existing settings.
    CaptionTextBox.Text = initialCaption

    If (Not String.IsNullOrEmpty(initialDataSourceId)) Then
      Dim dataSource As DataSource = OperationsDashboard.Instance.DataSources.FirstOrDefault(Function(ds) ds.Id = initialDataSourceId)

      If (Not DataSource Is Nothing) Then
        DataSourceSelector.SelectedDataSource = DataSource
        If (Not String.IsNullOrEmpty(initialField)) Then
          Dim field As ESRI.ArcGIS.Client.Field = dataSource.Fields.FirstOrDefault(Function(fld) fld.FieldName = initialField)
          FieldComboBox.SelectedItem = Field
        End If
      End If
    End If

  End Sub

  Private Sub OKButton_Click(sender As Object, e As RoutedEventArgs)

    DataSource = DataSourceSelector.SelectedDataSource
    Caption = CaptionTextBox.Text
    Field = CType(FieldComboBox.SelectedItem, ESRI.ArcGIS.Client.Field)

    DialogResult = True

  End Sub

  Private Sub DataSourceSelector_SelectionChanged(sender As Object, e As EventArgs)

    Dim dataSource As ESRI.ArcGIS.OperationsDashboard.DataSource = DataSourceSelector.SelectedDataSource
    FieldComboBox.ItemsSource = dataSource.Fields
    FieldComboBox.SelectedItem = dataSource.Fields(0)
   

  End Sub

  Private Sub ValidateInput(sender As Object, e As TextChangedEventArgs)

    If (OKButton Is Nothing) Then
      Return
    End If

    OKButton.IsEnabled = False
    If (String.IsNullOrEmpty(CaptionTextBox.Text)) Then
      Return
    End If

    OKButton.IsEnabled = True

  End Sub

End Class

End Namespace
